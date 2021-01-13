// -- Begin Startup Script Compatible -- //

// Whether or not to unify items in inventory
global["INVENTORY_UNIFY"] = true
// Whether or not to unify items in world
global["ITEM_UNIFY"] = true
// Whether or not to unify recipes
global["RECIPE_UNIFY"] = true
// Whether or not to hide not-first materials in jei (requires secondary script)
global["HIDE_UNIFIED_ITEMS"] = true
// Whether or not to disable non-priority ore-gen
global["UNIFY_ORE_GEN"] = true

// Mod priorities
global["unifypriorities"] = [
    "silents_mechanisms",
    "silentgems",
    "thermal",
    "chemlib",
    "mekanism"
]

// Add oredictionary tags here to unify (or use javascript to generate it!)
var tags = [
    "forge:plates/iron",
    "forge:gears/iron"
]
// Block tags for ore gen unification (an equal item tag is required for this to work, which is the case with ores normally)
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
    "forge:ores/sulfur",
]*/
// Easier way to add multiple tags (feel free to add empty extra tags, this will ignore them)
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
    "sulfur=dusts,ores"
]
for (let line of tagGen) {
    let data = line.split("=")
    for (let type of data[1].split(",")) {
        tags.push("forge:" + type + "/" + data[0])
    }
}

// Get priority items from tags
var tagitems = new Map()
tagLoop:
for (let tag of tags) {
    let stacks = Ingredient.of("#"+tag).getStacks().toArray()
    for (let mod of global["unifypriorities"]) {
        for (let stack of stacks) {
            if (stack.getMod() == mod) {
                tagitems[tag] = stack.getId()
                continue tagLoop
            }
        }
    }
    if (stacks.length > 0) tagitems[tag] = stacks[0].getId()
}
// Get priority blocks from tags
/*var tagblocks = new Map()
tagBLoop:
for (let btag of btags) {
    let blocks = Ingredient.of("#"+btag).getStacks().toArray()
    for (let mod of global["unifypriorities"]) {
        for (let block of blocks) {
            if (block.getMod() == mod) {
                tagblocks[btag] = block.getId()
                continue tagBLoop
            }
        }
    }
    if (blocks.length > 0) tagblocks[btag] = blocks[0].getId()
}*/

// Globalize tags (helps if separation is necessary, as is the case with jei hiding)
global["unifytags"] = tags
global["tagitems"] = tagitems
/*global["unifybtags"] = btags
global["tagblocks"] = tagblocks*/

// Ore gen (would be in startup_scripts)
/*onEvent("worldgen.remove", event => {
    console.log("sfasdfasdfqwe312341324")
    if (global["UNIFY_ORE_GEN"]) {
        for (btag of btags) {
            let blocks = Ingredient.of("#"+btag).getStacks().toArray()
            let tBlock = global["tagblocks"][btag]
            // python list comprehension would come in real handy here
            let blockIds = []
            for (let block of blocks) {
                if (block.getId() != tBlock) blockIds.push(block.getId())
            }
            
            console.log(blockIds)
            event.removeOres(ores => {
                ores.blocks = blockIds
            })
        }
    }
})*/

// -- End Startup Script Compatible -- //