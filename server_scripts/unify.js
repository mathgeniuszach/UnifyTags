// Whether or not to unify items in inventory
global["INVENTORY_UNIFY"] = true
// Whether or not to unify items in world
global["ITEM_UNIFY"] = true
// Whether or not to unify recipes
global["RECIPE_UNIFY"] = true
// Whether or not to hide not-first materials in jei (requires secondary script)
global["HIDE_UNIFIED_ITEMS"] = true
// Whether or not to disable non-priority ore-gen (THIS DOES NOT WORK AS OF CURRENTLY)
// global["UNIFY_ORE_GEN"] = true

// Mod priorities
global["unifypriorities"] = [
    "minecraft",
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

// Add oredictionary tags here to unify (or use javascript to generate it!). These are also higher priority than tagGen
var tags = [
    "forge:plates/iron",
    "forge:gears/iron",
    "forge:silicon"
]
// Block tags for ore gen unification (DOES NOT WORK CURRENTLY)
/*var btags = [
    "forge:ores/copper",
    "forge:ores/tin",
    "forge:ores/aluminum",
    "forge:ores/lead",
    "forge:ores/silver",
    "forge:ores/nickel",
    "forge:ores/platinum",
    "forge:ores/uranium",
    "forge:ores/iridium",
    "forge:ores/zinc",
    "forge:ores/osmium",
    "forge:ores/sulfur"
]*/
// Easier way to add multiple tags (feel free to add non-existant extra tags, this will ignore them)
var tagGen = [
    "gold=gears,plates",
    "diamond=gears,plates",
    "copper=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
    "tin=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
    "aluminum=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
    "lead=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
    "silver=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
    "nickel=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
    "bronze=storage_blocks,ingots,nuggets,dusts,ores,gears,plates",
    "steel=storage_blocks,ingots,nuggets,dusts",
    "platinum=storage_blocks,ingots,nuggets,dusts,ores",
    "uranium=storage_blocks,ingots,nuggets,dusts,ores",
    "iridium=storage_blocks,ingots,nuggets,dusts,ores",
    "zinc=storage_blocks,ingots,nuggets,dusts,ores",
    "osmium=ingots,ores",
    "sulfur=dusts,ores",
    "silicon=gems"
]
for (let line of tagGen) {
    let data = line.split("=")
    for (let type of data[1].split(",")) {
        tags.push("forge:" + type + "/" + data[0])
    }
}

function tryTag(tag) {
    try {
        return Ingredient.of("#"+tag)
    } catch (err) {
        return null
    }
}

// Replace input and output of recipes (and iterate over tags!)
onEvent("recipes", event => {
    // Iterate over tags (they should be loaded)
    var tagitems = new Map()
    tagLoop:
    for (let tag of tags) {
        let ingr = tryTag(tag)
        if (ingr) {
            let stacks = ingr.getStacks().toArray()
            for (let mod of global["unifypriorities"]) {
                for (let stack of stacks) {
                    if (stack.getMod() == mod) {
                        if (!global["unifyexclude"].has(stack.getId())) tagitems[tag] = stack.getId()
                        continue tagLoop
                    }
                }
            }
            if (stacks.length > 0) tagitems[tag] = stacks[0].getId()
        }
    }
    // Update tags
    global["unifytags"] = tags
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
onEvent("player.inventory.changed", event => {
    if (global["INVENTORY_UNIFY"] && event.getEntity().getOpenInventory().getClass().getName() == "net.minecraft.inventory.container.PlayerContainer") {
        // Get held item
        var heldItem = event.getItem()
        var itemId = heldItem.getId()
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

// Items on ground
onEvent("entity.spawned", event => {
    if (global["ITEM_UNIFY"]) {
        var entity = event.getEntity()
        if (entity.getType() == "minecraft:item") {
            var gItem = entity.getItem()
            var itemId = gItem.getId()
            // Check if item is excluded
            if (global["unifyexclude"].has(itemId)) return

            if (gItem) {
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
    }
})