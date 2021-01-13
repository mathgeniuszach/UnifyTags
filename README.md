# UnifyTags

## Description

UnifyTags is an item unifier similar to [InstantUnify](https://www.curseforge.com/minecraft/mc-mods/instantunify) and [UniDict](https://www.curseforge.com/minecraft/mc-mods/unidict). It works through [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) and unifies items in the world, items in your inventory, and some recipes based upon tags (oreDict) so you will only ever have to worry about one ingot of a given material instead of the many given by different mods. You can configure what tags get unified in the `server-only-unify.js` or `startup_scripts/unify.js` depending on what type of script you use.

## Features

- Unify item entities (and therefore drops from blocks except from quarries)
- Unify items when they go into your inventory
- Unify certain recipes
- Hide unified materials through JEI

## Installing

In order to run UnifyTags, you need [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) installed on either the forge or fabric version of Minecraft.

There are two versions of UnifyTags you can install (only install one type, not both):

1. Server-Side Only: put `server-only-unify.js` in `.minecraft\kubejs\startup_scripts` to make UnifyTags run server side only. You will not have JEI hiding unified materials and items. Changes you make to tags and such can be reloaded with `/reload`.
2. Client & Server-Side: put the folders into `.minecraft\kubejs` to make UnifyTags run on both the client and server. JEI will hide unified materials so you only ever see in the sidebar the main material. Changes you make to tags and such require a game restart (though you can get around it by copying the unify startup script into the top of the unify server script, but this isn't always reliable for jei due to unknown loading order).

## License

Use this in whatever modpack you want, with or without telling me. Modify and sell it too if you want. I don't mind so long as you're honest about the script's origin and what you did to it.
