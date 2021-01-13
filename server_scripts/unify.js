// Handle inventory change (to check for unificaiton)
// Unfortunately it gets called twice due to setting the inventory.
onEvent("player.inventory.changed", event => {
    if (global["INVENTORY_UNIFY"] && event.getEntity().getOpenInventory().getClass().getName() == "net.minecraft.inventory.container.PlayerContainer") {
        // Get held item
        var heldItem = event.getItem()
        
        // Check for every tag in the list
        for (let tag of global["unifytags"]) {
            if (Ingredient.of("#"+tag).test(heldItem)) {
                // If item is in tag, determine if it needs to be changed
                let tItem = global["tagitems"][tag]
                if (tItem != heldItem.getId()) {
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
            // Check for every tag in the list
            for (let tag of global["unifytags"]) {
                if (Ingredient.of("#"+tag).test(gItem)) {
                    // If item is in tag, determine if it needs to be changed
                    let tItem = global["tagitems"][tag]
                    if (tItem != gItem.getId()) {
                        entity.setItem(Item.of(tItem, gItem.getCount()))
                    }
                    break
                }
            }
        }
    }
})

// Replace input and output of recipes
onEvent("recipes", event => {
    if (global["RECIPE_UNIFY"]) {
        for (let tag of global["unifytags"]) {
            let stacks = Ingredient.of("#"+tag).getStacks().toArray()
            let oItem = global["tagitems"][tag]
            for (let tItem of stacks) {
                event.replaceInput({}, tItem.getId(), "#"+tag)
                event.replaceOutput({}, tItem.getId(), oItem)
            }
        }
    }
})