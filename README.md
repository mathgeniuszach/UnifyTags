# UnifyTags

## Description

UnifyTags is an item unifier similar to [InstantUnify](https://www.curseforge.com/minecraft/mc-mods/instantunify) and [UniDict](https://www.curseforge.com/minecraft/mc-mods/unidict). It works through [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) and unifies items in the world, items in your inventory, and some recipes based upon tags (oreDict) so you will only ever have to worry about one ingot of a given material instead of the many given by different mods. You can configure what tags get unified in the `server_scripts/unify.js` script. Changes are applied on server reload, unless you utilize the cache

## Features

- Unify item entities (and therefore drops from blocks except from quarries)
- Unify items when they go into your inventory
- Unify certain recipes automatically (like crafting and smelting)
- Hide unified materials through JEI/REI (might require using the cache). Note that only REI works on Fabric.
- Optionally cache all items in tags so they can work properly client side.

## Installing

In order to run UnifyTags, you need [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) installed on either the forge or fabric version of Minecraft. After KubeJS is installed, drag and drop the three folders (`server_scripts`, `client_scripts`, and `startup_scripts`) into `.minecraft/kubejs` and UnifyTags will work on server startup or server reload. If you are running a server, you only need `server_scripts` installed server side and `client_scripts` installed client side; if you are using a cache, make sure `startup_scripts` is also installed both in the client and in the server.

## Using the Cache

In order to make unified materials hide themselves properly in JEI/REI, you may need to utilize the caching feature. This will save a list of tags and some configured options to a JSON file and will make it so any time you join any other server or reload JEI/REI those values will be used. To use the cache, set `global["CACHE_TAGS"] = true` in the startup file. To generate the cache, join a singleplayer world (you can find the cache in the /kubejs/config/ folder as `unify_cache.json`). You must delete the json file to clear the cache; any time you make a change to the configuration, or add/remove a mod that uses those tags, make sure to delete the cache, reboot the game, and regenerate the cache. Note that every client should also have the same copy of the cache as the server, to make sure the right items are hidden from REI that would be unified by the server.

## License

Use this in whatever modpack you want, with or without telling me. Modify and sell it too if you want. I don't mind so long as you're honest about the script's origin and what you did to it.
