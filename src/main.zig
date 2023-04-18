const std = @import("std");
const zigfitsio = @import("zigfitsio");

fn example(args: []const [*c]const u8) !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("args: {any}\n", .{args});

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    var alloc = gpa.allocator();

    const n = std.mem.indexOfSentinel(u8, 0, args[args.len - 1]);
    const filename = args[args.len - 1][0..n];
    try stdout.print("filename: {s}\n", .{filename});
    var fits = try zigfitsio.FITS.initFromFile(filename);
    defer fits.deinit();

    var records = try fits.getAllInfo(alloc);
    defer alloc.free(records);

    // first record contains bad characters ?
    for (records[1..]) |r| {
        try stdout.print("{s}\n", .{r});
    }
}

// for some odd reason this symbol becomes undefined?
export fn clock() i64 {
    return 1;
}

// wasi requires a main entry, despite it being a shared library
export fn main(argc: i32, argv: **u8) i32 {
    const n = @intCast(usize, argc);
    const args = @ptrCast([*][*c]const u8, argv)[0..n];

    // poor mans errors
    example(args) catch |e| {
        std.io.getStdOut().writer().print("ERR: {any}\n", .{e}) catch {};
    };
    return 0;
}
