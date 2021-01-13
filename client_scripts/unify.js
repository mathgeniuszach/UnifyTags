// If this is giving you errors on line 4, Try cutting the startup script compatible section into a startup script instead.
onEvent("jei.hide.items", event => {
    if (global["HIDE_UNIFIED_ITEMS"]) {
        for (let tag of global["unifytags"]) {
            let stacks = Ingredient.of("#"+tag).getStacks().toArray()
            let tItem = global["tagitems"][tag]
            for (let s of stacks) {
                if (s.getId() != tItem) event.hide(s.getId())
            }
        }
    }
})