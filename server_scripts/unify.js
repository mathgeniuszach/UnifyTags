// ---------- CONFIG ----------

// Whether or not to unify items in inventory
global["INVENTORY_UNIFY"] = true
// Whether or not to unify items in world
global["ITEM_UNIFY"] = true
// Whether or not to unify recipes
global["RECIPE_UNIFY"] = true
// Whether or not to attempt to remove duplicate recipes
// Requires "RECIPE_UNIFY" to be true, and two items with different nbt are considered the same item.
global["RECIPE_DEDUPE"] = true

// To configure caching, go to the startup script.

// For configuring JEI hides, go to the client side script.

// Mod priorities
global["unifypriorities"] = [
    "techreborn",
    "thermal",
    "mekanism",
    "create",
    "assemblylinemachines",
    "futurepack",
    "tconstruct",
    "tinkers_reforged",
    "minecraft"
]

// Items to exclude (will not be unified)
global["unifyexcludegen"] = [
    // "minecraft:stone"
]

// Add oredictionary tags here to unify (or use javascript to generate it!). These are also higher priority than tagGen.
// Non-existant tags will be ignored.
let tags = new Set([
    "forge:plates/iron",
    "forge:gears/iron",
    "forge:silicon"
])

// A list of lists of items to unify. Each list will be turned into a tag and added to the list of tags to unify.
// Accepts Regex. You can preface an id with # to make it add all the items from that tag.
let customtags = [
    // ["mod_a:rope", "mod_b:rope"], // Unifies rope from mod_a and mod_b
    // ["mod_c:dinosaur", "mod_b:dinosaur"] // Unifies the dinosaur item from mod_c and mod_b
]

// Adds items into the first string in each list. If a tag does not exist, it will be created.
let tagUnions = [
    // Regex is supported, excluding the first string. The first string to merge into must not have a #, but other ones must.
    // The first string may optionally use one equal sign and commas like how tagSplits does.
    // ["forge:plates/iron", "#annoyingmod:iron_plates", "#anothermod:iron_plates", "thirdmod:iron_plate"]
    ["forge:ores_in_ground/deepslate", /thermal:deepslate_.*_ore/g],
    ["forge:ores_in_ground/stone", /thermal:(?!deepslate).*_ore/g]
]

// Split tags apart to create new ones. If a tag does not exist, it will not be merged into or used.
// NOTE: THIS FEATURE IS FOR 1.18+ ONLY! IT DOES NOT DO ANYTHING ON 1.16 OR BELOW.
// BLAME THE KUBEJS DEVS FOR MAKING THE gatherAllItemIDs() METHOD PRIVATE.
let tagSplits = [
    // Makes it so that deepslate, netherrack, and stone ores are unified separately.
    [
        "forge:ores/=copper,tin,aluminum,lead,silver,nickel,bronze,steel,platinum,uranium,iridium,zinc,osmium,sulfur",
        "forge:ores_in_ground/=deepslate,netherrack",
        "forge:ores_in_ground/stone"
    ]
]


// ---------- PLATFORM SPECIFIC ----------

if (Platform.isForge()) {
    // Easier way to add multiple tags on forge (all items here are inserted into the tags set)
    let tagGen = [
        "gold,diamond=gears,plates",
        "copper,tin,aluminum,lead,silver,nickel,bronze,steel,platinum,uranium,iridium,zinc"
        + "=storage_blocks,ingots,nuggets,dusts,ores,gears,plates,raw_materials",
        "raw_copper,raw_tin,raw_aluminum,raw_lead,raw_silver,raw_nickel,raw_bronze,raw_steel,raw_platinum,raw_uranium,raw_iridium,raw_zinc=storage_blocks",
        "osmium=ingots,ores",
        "sulfur=dusts,ores",
        "netherite=dusts",
        "silicon=gems"
    ]

    for (let line of tagGen) {
        let data = line.split("=")
        let ms = (data[0]).split(",")
        let ts = (data[1]).split(",")

        for (let type of ts) {
            for (let material of ms) {
                tags.add("forge:" + type + (material.length > 0 ? "/" + material : ""))
            }
        }
    }
} else if (Platform.isFabric()) {
    // Easier way to add multiple tags on fabric (all items here are inserted into the tags set)
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
        "sheldonite=ores",
        "raw_copper,raw_gold,raw_iridium,raw_iron,raw_lead,raw_silver,raw_tin,raw_tungsten"
        + "=blocks,ores"
    ]
    for (let line of tagGen) {
        let data = line.split("=")
        let ms = (data[0]).split(",")
        let ts = (data[1]).split(",")

        for (let material of ms) {
            for (let type of ts) {
                tags.add("c:" + material + (type.length > 0 ? "_" + type : ""))
            }
        }
    }
}

// ---------- END PLATFORM SPECIFIC ----------

// ---------- END CONFIG ----------








// Generator which splits equal sign comma stuff
function esplit(str) {
    let data = str.split("=")
    if (data.length == 1) {
        for (let v of data[0].split(",")) yield v
    } else if (data.length == 2) {
        for (let l of data[0].split(",")) {
            for (let r of data[1].split(",")) {
                yield l+r
            }
        }
    } else {
        throw Error("too many equal signs")
    }
}

// Function that attempts to get a tag, if it fails, it returns undefined.
function tryTag(tag) {
    try {
        return Ingredient.of("#" + tag)
    } catch (err) {
        return undefined
    }
}

let e_tags_items = event => {
    if (!("cache" in global)) {
        // Create custom tags
        let root = "unifytags:tag"
        let i = 0
        for (let ctag of customtags) {
            let tag = event.get(root + i)

            // Add items into tag
            for (let item of ctag) {
                try {
                    tag.add(item)
                } catch (err) { }
            }

            // Add new tag into tags to unify
            tags.add(root + i)
            ++i
        }

        // Union tags
        for (let union of tagUnions) {
            for (let sum of esplit(union[0])) {
                let tag = event.get(sum)
                for (let item of union.slice(1)) {
                    try {
                        tag.add(item)
                    } catch (err) { }
                }
            }
        }

        // Create tags from intersections (1.18+ only)
        if (global["VERSION"][1] >= 18) {
            for (let split of tagSplits) {
                for (let sum of esplit(split[0])) {
                    let sumtag = tryTag(sum)
                    if (!sumtag) continue
                    
                    let sumset = new Set()
                    let sumevget = event.get(sum)
                    
                    
                    let sumitems;
                    let fname = "getObjectIds"
                    try {
                        sumitems = sumevget.getObjectIds()
                    } catch (err) {
                        try {
                            sumitems = sumevget.getAllItemIds()
                            fname = "getAllItemIds"
                        } catch (err) {
                            sumitems = sumevget.gatherAllItemIDs()
                            fname = "gatherAllItemIDs"
                        }
                    }
                    
                    for (let v of sumitems) {
                        sumset.add(String(v))
                    }

                    // Perform intersection
                    for (let intersectors of split.slice(1)) {
                        for (let intersector of esplit(intersectors)) {
                            let intertag = tryTag(intersector)
                            if (!intertag) continue

                            // Ok, actually do the test to perform the intersection
                            let tag = event.get(root + i)
                            for (let item of event.get(intersector)[fname]()) {
                                if (sumset.has(String(item))) tag.add(String(item))
                            }

                            // Add tag to list of tags to unify
                            tags.add(root + i)
                            ++i
                        }
                    }

                    // Remove original tag from tags to unify
                    tags.delete(sum)
                }
            }
        }
    }
}

// Replace input and output of recipes
let e_recipes = event => {
    // If the cache is already generated, this doesn't need to run again
    if (!("cache" in global)) {
        // Necessary since Rhino doesn't support the spread operator
        global["unifyexclude"] = new Set(global["unifyexcludegen"])

        // Maps item ids to a tag to unify them in. Makes unification fast.
        let itemsToTags = {}
        // Maps item tag ids to a list of string
        let tagItems = {}
        // Maps tags to their priority item
        let tagPriorityItems = {}

        for (let tag of tags) {
            let itag = tryTag(tag)
            if (itag) {
                // Only load tags with 2 or more items
                let stacks = itag.getStacks().toArray()
                if (stacks.length > 1) {
                    // Get the priority item for this tag
                    let priorityItem = String(stacks[0].getId())
                    priorityLoop:
                    for (let mod of global["unifypriorities"]) {
                        for (let stack of stacks) {
                            if (stack.getMod() == mod) {
                                let id = String(stack.getId())
                                if (!global["unifyexclude"].has(id)) {
                                    priorityItem = id
                                    break priorityLoop
                                }
                            }
                        }
                    }

                    tagPriorityItems[tag] = priorityItem

                    // Get all items in this tag
                    let items = []
                    for (let stack of stacks) {
                        let id = String(stack.getId())
                        if (!(id in itemsToTags)) itemsToTags[id] = tag
                        items.push(id)
                    }

                    tagItems[tag] = items
                }
            }
        }

        // Globalize maps
        global["itemsToTags"] = itemsToTags
        global["tagItems"] = tagItems
        global["tagPriorityItems"] = tagPriorityItems

        // Make cache (since it doesn't exist)
        if (global["CACHE_TAGS"]) {
            // Save cached stuff json file
            global["cache"] = {
                itemsToTags: itemsToTags,
                tagItems: tagItems,
                tagPriorityItems: tagPriorityItems,
                unifyexclude: global["unifyexcludegen"]
            }
            JsonIO.write("kubejs/config/unify_cache.json", global["cache"])
        }
    }
    
    if (global["RECIPE_UNIFY"]) {
        
        for (let tag of Object.keys(global["tagItems"])) {
            let stacks = global["tagItems"][tag]
            let priorityId = global["tagPriorityItems"][tag]
            for (let itemId of stacks) {
                if (global["unifyexclude"].has(itemId)) continue

                // Replace any time the item appears as an input, with the whole tag
                event.replaceInput({}, itemId, "#" + tag)
                // Replace any time the item appears as an output, with the priority item
                // (Unless this is the priority item itself, then do nothing)
                if (itemId != priorityId) event.replaceOutput({}, itemId, priorityId)
            }

            // Attempt at removing duplicate recipes that arise with the same input and output
            if (global["RECIPE_DEDUPE"]) {
                // Iterate over every recipe that has the output specified
                let rtypes = {}
                event.forEachRecipe({output: priorityId}, (r) => {
                    // Calculate the "hash" of this recipe based on it's ingredients
                    let hash = []
                    r.outputItems.forEach((stack) => {
                        hash.push(stack.getId(), "+", stack.getCount(), ",")
                    })
                    hash.push(";")
                    r.inputItems.forEach((ingredient) => {
                        ingredient.getItemIds().forEach((item) => {
                            hash.push(item, "/")
                        })
                        hash.push(",")
                    })

                    // Determine if the recipe has been seen before using the type and hash
                    let rtype = r.getType()
                    if (rtype in rtypes) {
                        // Not the first recipe of this type
                        if (rtypes[rtype].has(hash)) {
                            // Recipe match found. Delete this recipe
                            // RecipeJS.removedRecipes.add() is not public, so we're doing this instead.
                            event.remove({id: r.getId().toString()})
                        }
                    } else {
                        // First recipe of this type, add it's "hash"
                        rtypes[rtype] = new Set([hash.join("")])
                    }
                })
            }
        }
    }
}

if (global["V6P"]) {
    ServerEvents.tags("item", e_recipes)
    ServerEvents.recipes(e_recipes)
} else {
    onEvent("tags.items", e_tags_items)
    onEvent("recipes", e_recipes)
}

let invnames = new Set([
    "net.minecraft.inventory.container.PlayerContainer",
    "net.minecraft.class_1723",
    "net.minecraft.world.inventory.InventoryMenu"
])

// Handle inventory change (to check for unificaiton)
// Unfortunately it gets called twice due to setting the inventory.
if (global["INVENTORY_UNIFY"]) {
    let e_player_inventory_changed = event => {
        let ename = String(event.getEntity().getOpenInventory().getClass().getName())
        if (invnames.has(ename)) {
            // Get held item
            let heldItem = event.getItem()
            let itemId = String(heldItem.getId())

            // Check if item is excluded
            if (global["unifyexclude"].has(itemId)) return

            // Check if this item is in a tag that needs to be unified
            let itemTag = global["itemsToTags"][itemId]
            if (!itemTag) return

            // Check if the item is the priority item (if so, it does not need to be unified)
            let priorityId = global["tagPriorityItems"][itemTag]
            if (itemId == priorityId) return

            // All checks have determined that this item must be unified.
            // Fix slot number
            let slot = event.getSlot()
            if (slot <= 5) slot += 36
            else if (slot == 45) slot = 40
            else if (slot >= 36) slot -= 36

            // Update item
            event.getEntity().inventory.set(slot, Item.of(priorityId, heldItem.getCount()))
        }
    }

    if (global["V6P"]) {
        PlayerEvents.inventoryChanged(e_player_inventory_changed)
    } else {
        onEvent("player.inventory.changed", e_player_inventory_changed)
    }
}

// Items on ground
if (global["ITEM_UNIFY"]) {
    let e_entity_spawned = event => {
        // Check if an item has spawned
        let entity = event.getEntity()
        if (entity.getType() != "minecraft:item") return

        // Obtain item
        let entityItem = entity.getItem()
        if (!entityItem) return
        let itemId = String(entityItem.getId())

        // Check if item is excluded
        if (global["unifyexclude"].has(itemId)) return

        // Check if this item is in a tag that needs to be unified
        let itemTag = global["itemsToTags"][itemId]
        if (!itemTag) return

        // Check if the item is the priority item (if so, it does not need to be unified)
        let priorityId = global["tagPriorityItems"][itemTag]
        if (itemId == priorityId) return

        // All checks have determined that this item must be unified.
        // Change the item entity's item.
        entity.setItem(Item.of(priorityId, entityItem.getCount()))
    }

    if (global["V6P"]) {
        EntityEvents.spawned(e_entity_spawned)
    } else {
        onEvent("entity.spawned", e_entity_spawned)
    }
}
