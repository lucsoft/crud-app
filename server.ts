import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import { Bulk, connect } from "https://deno.land/x/redis@v0.32.4/mod.ts";
import { ulid } from "jsr:@std/ulid";
import { Game } from "./types.ts";
// deno-lint-ignore-file no-explicit-any

// Containers a Redis map of games
const redis = await connect({
    hostname: "localhost"
});

const gameRoute = new URLPattern({ pathname: "/games/:id" });
const gamesRoute = new URLPattern({ pathname: "/games" });

Deno.serve({
    onError: (err) => {
        console.error(err);
        try {
            // @ts-ignore ignore that missing typecast
            return Response.json({ type: "error", message: err.message });
        } catch {
            return Response.json({ type: "error" });
        }
    }
}, async (res) => {
    const url = new URL(res.url);
    const headers = {
        "Access-Control-Allow-Origin": res.headers.get("Origin") || "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=86400"
    };

    console.log(Number(performance.now().toFixed(2)), res.method, url.pathname);
    if (res.method === "GET" && gameRoute.test(url)) {
        const id = gameRoute.exec(url)!.pathname.groups.id;
        const game = await redis.get("game:" + id);
        return Response.json(game, { headers });
    }

    if (res.method === "GET" && gamesRoute.test(url)) {
        const keys = await redis.keys("game:*");
        if (keys.length === 0) {
            return Response.json({
                type: "success",
                list: [],
                hasMore: false
            }, { headers });
        }
        const games = await redis.mget(...keys);
        return Response.json({
            type: "success",
            list: games.map((game: Bulk) => JSON.parse(game!)),
            hasMore: false
        }, { headers });
    }

    if (res.method === "POST" && gamesRoute.test(url)) {
        const game: Game = await res.json();
        assert(game.metadata, "metadata is required");
        assert(game.spec, "spec is required");
        assert(game.metadata.name, "metadata.name is required");

        const id = ulid();

        await redis.set("game:" + id, JSON.stringify({
            metadata: {
                ...game.metadata,
                ulid: id,
                creationDate: new Date(),
                lastModifiedDate: new Date()
            },
            spec: game.spec
        }));

        return Response.json({ type: "success", id }, { headers });
    }

    return Response.json({ type: "success" }, { headers });
});