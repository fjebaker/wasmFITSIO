const std = @import("std");
const zigFITSIO = @import("./vendor/zigFITSIO/zigFITSIO.zig");

pub fn build(b: *std.Build) !void {
    const cross_target = try std.zig.CrossTarget.parse(.{
        .arch_os_abi = "wasm32-wasi",
    });
    const target = b.standardTargetOptions(.{ .default_target = cross_target });
    const optimize = b.standardOptimizeOption(.{});

    const lib = b.addSharedLibrary(.{
        .name = "wasmFITSIO",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
        .version = .{ .major = 0, .minor = 1 },
    });
    const zigfitsio = zigFITSIO.create(b, target);
    zigfitsio.link(lib);
    b.installArtifact(lib);
}
