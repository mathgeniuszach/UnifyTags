# UnifyTags

## Description

UnifyTags is an item unifier similar to [InstantUnify](https://www.curseforge.com/minecraft/mc-mods/instantunify) and [UniDict](https://www.curseforge.com/minecraft/mc-mods/unidict). It works through [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) and unifies items in the world, items in your inventory, and some recipes based upon tags (oreDict) so you will only ever have to worry about one ingot of a given material instead of the many given by different mods. You can configure what tags get unified in the `server_scripts/unify.js` script. Changes are applied on server reload.

## Features

- Unify item entities (and therefore drops from blocks except from quarries)
- Unify items when they go into your inventory
- Unify certain recipes automatically (like crafting and smelting)
- Hide unified materials through JEI

## Installing

In order to run UnifyTags, you need [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) installed on either the forge or fabric version of Minecraft. After KubeJS is installed, drag and drop the two folders (`server_scripts` and `client_scripts`) into `.minecraft/kubejs` and UnifyTags will work on server startup or server reload. If you are running a server, you only need `server_scripts` installed server side and `client_scripts` installed client side.

## License

Use this in whatever modpack you want, with or without telling me. Modify and sell it too if you want. I don't mind so long as you're honest about the script's origin and what you did to it.
