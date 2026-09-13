import torch
import torch.nn as nn
from typing import Sequence

class Convolution(nn.Sequential):
    def __init__(self, in_channels: int, out_channels: int, strides: int = 1, kernel_size: int = 3, is_transposed: bool = False, conv_only: bool = False):
        super().__init__()
        padding = (kernel_size - 1) // 2
        if is_transposed:
            conv = nn.ConvTranspose3d(in_channels, out_channels, kernel_size=kernel_size, stride=strides, padding=padding, output_padding=strides - 1 if strides > 1 else 0)
        else:
            conv = nn.Conv3d(in_channels, out_channels, kernel_size=kernel_size, stride=strides, padding=padding)
        self.add_module("conv", conv)
        if not conv_only:
            adn = nn.Sequential()
            adn.add_module("A", nn.PReLU(num_parameters=1, init=0.25))
            self.add_module("adn", adn)

class ResidualUnit(nn.Module):
    def __init__(self, in_channels: int, out_channels: int, strides: int = 1, kernel_size: int = 3, subunits: int = 2):
        super().__init__()
        self.conv = nn.Sequential()
        for i in range(subunits):
            cin = in_channels if i == 0 else out_channels
            cstride = strides if i == 0 else 1
            self.conv.add_module(f"unit{i}", Convolution(cin, out_channels, strides=cstride, kernel_size=kernel_size))
        
        if in_channels != out_channels or strides != 1:
            self.residual = nn.Conv3d(in_channels, out_channels, kernel_size=3 if strides > 1 else 1, stride=strides, padding=1 if strides > 1 else 0)
        else:
            self.residual = nn.Identity()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        res = self.residual(x)
        cx = self.conv(x)
        return cx + res

class SimpleConvUnit(nn.Module):
    def __init__(self, in_channels: int, out_channels: int, conv_only: bool = False):
        super().__init__()
        self.conv = nn.Sequential()
        self.conv.add_module("unit0", Convolution(in_channels, out_channels, strides=1, kernel_size=3, conv_only=conv_only))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.conv(x)

class SkipConnection(nn.Module):
    def __init__(self, submodule: nn.Module):
        super().__init__()
        self.submodule = submodule

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        prev = self.submodule(x)
        return torch.cat([prev, x], dim=1)

class UNet3D(nn.Module):
    def __init__(
        self,
        in_channels: int = 1,
        out_channels: int = 2,
        channels: Sequence[int] = (16, 32, 64, 128, 256),
        strides: Sequence[int] = (2, 2, 2, 2),
    ):
        super().__init__()
        self.channels = channels
        self.strides = strides

        def _create_block(inc: int, outc: int, ch: Sequence[int], st: Sequence[int], is_top: bool) -> nn.Module:
            c = ch[0]
            s = st[0]
            if len(ch) > 2:
                subblock = _create_block(c, c, ch[1:], st[1:], False)
                upc = c * 2
            else:
                subblock = ResidualUnit(c, ch[1], strides=1, subunits=2)
                upc = c + ch[1]

            down = ResidualUnit(inc, c, strides=s, subunits=2)
            up = nn.Sequential(
                Convolution(upc, outc, strides=s, is_transposed=True),
                SimpleConvUnit(outc, outc, conv_only=is_top)
            )
            return nn.Sequential(down, SkipConnection(subblock), up)

        self.model = _create_block(in_channels, out_channels, self.channels, self.strides, True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.model(x)

def load_spleen_unet(model_path: str) -> nn.Module:
    """Loads spleen 3D UNet weights with pure PyTorch - zero external framework dependencies!"""
    unet = UNet3D(
        in_channels=1,
        out_channels=2,
        channels=(16, 32, 64, 128, 256),
        strides=(2, 2, 2, 2),
    )
    state_dict = torch.load(model_path, map_location="cpu", weights_only=False)
    unet.load_state_dict(state_dict)
    unet.eval()
    return unet
