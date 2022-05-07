// ---------- CONFIG ----------

// Whether or not to unify items in inventory
global["INVENTORY_UNIFY"] = true
// Whether or not to unify items in world
global["ITEM_UNIFY"] = true
// Whether or not to unify recipes
global["RECIPE_UNIFY"] = true
// Whether or not to hide not-first materials in jei (requires secondary script)
global["HIDE_UNIFIED_ITEMS"] = true

// Mod priorities
global["unifypriorities"] = [
    "minecraft",
    "techreborn",
    "alltheores",
    "mekanism",
    "thermal",
    "silents_mechanisms",
    "silentgems",
    "chemlib"
]
// Items to exclude (will not be unified)
global["unifyexclude"] = new Set([
    // "minecraft:stone"
])

// Add oredictionary tags here to unify (or use javascript to generate it!). These are also higher priority than tagGen.
// Non-existant tags will be ignored.
let tags = [
    "forge:plates/iron",
    "forge:gears/iron",
    "forge:silicon"
]

// ---------- PLATFORM SPECIFIC ----------

if (Platform.isForge()) {
    // Easier way to add multiple tags on forge
    let tagGen = [
        "gold,diamond=gears,plates",
        "copper,tin,aluminum,lead,silver,nickel,bronze,steal,platinum,uranium,iridium,zinc"
            + "=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
        "osmium=ingots,ores",
        "sulfur=dusts,ores",
        "silicon=gems"
    ]
    for (let line of tagGen) {
        let data = line.split("=")
        for (let type of data[1].split(",")) {
            for (let material of data[0].split(",")) {
                tags.push("forge:" + type + (data[0].length > 0 ? "/" + data[0] : ""))
            }
        }
    }
} else if (Platform.isFabric()) {
    // Easier way to add multiple tags on fabric
    let tagGen = [
        "advanced_alloy=ingots,plates",
        "almandine,andesite,andradite,ashes,calcite,charcoal,clay,dark_ashes,diorite,"
        + "ender_eye,ender_pearl,endstone,flint,granite,grossular,magnesium,manganese,"
        + "marble,netherrack,olivine,phosphorous,pyrope,saltpeter,saw,spessartine,sulfur,"
        + "uvarovite"
            + "=dusts,small_dusts",
        "aluminum,brass,bronze,chrome,copper,electrum,invar,iridium,lead,nickel,platinum,"
        + "silver,steel,tin,titanium,tungsten,zinc"
            + "=blocks,dusts,ingots,nuggets,ores,plates,small_dusts",
        "basalt=,dusts,small_dusts",
        "bauxite,cinnabar,galena,pyrite,sodalite,sphalerite=dusts,ores,small_dusts",
        "carbon,magnalium,silicon=plates",
        "coal,gold,iron,redstone=dusts,ores,plates,small_dusts",
        "diamond,emerald=dusts,nuggets,ores,plates,small_dusts",
        "glowstone=small_dusts",
        "iridium_alloy=ingots,plates",
        "lapis=ores,plates",
        "lazurite,obsidian,quartz=dusts,plates,small_dusts",
        "mixed_metal=ingots",
        "peridot,red_garnet,ruby,sapphire,yellow_garnet=blocks,dusts,gems,ores,plates,small_dusts",
        "refined_iron,tungstensteel=blocks,ingots,nuggets,plates",
        "rubies=",
        "sheldonite=ores"
    ]
    for (let line of tagGen) {
        let data = line.split("=")
        for (let type of data[1].split(",")) {
            for (let material of data[0].split(",")) {
                tags.push("c:" + type + (material.length > 0 ? "_" + material : ""))
            }
        }
    }
}

// ---------- END PLATFORM SPECIFIC ----------

// ---------- END CONFIG ----------








function tryTag(tag) {
    try {
        return Ingredient.of("#"+tag)
    } catch (err) {
        return null
    }
}

// Replace input and output of recipes (and iterate over tags!)
onEvent("recipes", event => {
    // Iterate over tags to generate tagitems and remove bad tags (they should be loaded)
    let truetags = []
    let tagitems = new Map()
    tagLoop:
    for (let tag of tags) {
        let ingr = tryTag(tag)
        if (ingr) {
            let stacks = ingr.getStacks().toArray()
            // Only load tags with 2 or more items
            if (stacks.length > 1) {
                truetags.push(tag)

                for (let mod of global["unifypriorities"]) {
                    for (let stack of stacks) {
                        if (stack.getMod() == mod) {
                            if (!global["unifyexclude"].has(stack.getId())) tagitems[tag] = stack.getId()
                            continue tagLoop
                        }
                    }
                }
            
                tagitems[tag] = stacks[0].getId()
            }
        }
    }

    // Globalize tags
    global["unifytags"] = truetags
    global["tagitems"] = tagitems
    
    // Unify the rest
    if (global["RECIPE_UNIFY"]) {
        for (let tag of global["unifytags"]) {
            let ingr = tryTag(tag)
            if (ingr) {
                let stacks = ingr.getStacks().toArray()
                let oItem = global["tagitems"][tag]
                for (let tItem of stacks) {
                    let itemId = tItem.getId()
                    if (global["unifyexclude"].has(itemId)) continue
                    
                    event.replaceInput({}, itemId, "#"+tag)
                    event.replaceOutput({}, itemId, oItem)
                }
            }
        }
    }
})

// Handle inventory change (to check for unificaiton)
// Unfortunately it gets called twice due to setting the inventory.
if (global["INVENTORY_UNIFY"]) {
    onEvent("player.inventory.changed", event => {
        if (event.getEntity().getOpenInventory().getClass().getName() == "net.minecraft.inventory.container.PlayerContainer") {
            // Get held item
            let heldItem = event.getItem()
            let itemId = heldItem.getId()
            // Check if item is excluded
            if (global["unifyexclude"].has(itemId)) return
            
            // Check for every tag in the list
            for (let tag of global["unifytags"]) {
                let ingr = tryTag(tag)
                if (ingr && ingr.test(heldItem)) {
                    // If item is in tag, determine if it needs to be changed
                    let tItem = global["tagitems"][tag]
                    if (tItem != itemId) {
                        // Fix slot number
                        let slot = event.getSlot()
                        if (slot <= 5) slot += 36
                        else if (slot == 45) slot = 40
                        else if (slot >= 36) slot -= 36
                        // Update item
                        event.getEntity().inventory.set(slot, Item.of(tItem, heldItem.getCount()))
                    }
                    break
                }
            }
        }
    })
}

// Items on ground
if (global["ITEM_UNIFY"]) {
    onEvent("entity.spawned", event => {
        let entity = event.getEntity()
        if (entity.getType() == "minecraft:item") {
            let gItem = entity.getItem()
            if (gItem) {
                let itemId = gItem.getId()
                // Check if item is excluded
                if (global["unifyexclude"].has(itemId)) return

                // Check for every tag in the list
                for (let tag of global["unifytags"]) {
                    let ingr = tryTag(tag)
                    if (ingr && ingr.test(gItem)) {
                        // If item is in tag, determine if it needs to be changed
                        let tItem = global["tagitems"][tag]
                        if (tItem != itemId) {
                            entity.setItem(Item.of(tItem, gItem.getCount()))
                        }
                        break
                    }
                }
            }
        }
    })
}
