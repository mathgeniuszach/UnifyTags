// Whether or not to hide not-first materials in jei
global["HIDE_UNIFIED_ITEMS"] = true

function tagStacks(tag) {
    if ("cache" in global) {
        return global["cache"][tag]
    } else {
        try {
            return Ingredient.of("#" + tag)
        } catch (err) {
            return undefined
        }
    }
}
function loadCache() {

}

function hideItems(event) {
    try {
        for (let tag of global["unifytags"]) {
            let stacks = tagStacks(tag)
            if (ingr) {
                let tItem = global["tagitems"][tag]
                for (let s of stacks) {
                    if (s.getId() != tItem && !global["unifyexclude"].has(s.getId())) event.hide(s.getId())
                }
            }
        }
    } catch (err) {
        console.warn("Failure to hide unified items. Press F3+T to reload client and retry")
        console.error(err)
    }
}

if (global["HIDE_UNIFIED_ITEMS"]) {
    onEvent("jei.hide.items", hideItems)
    onEvent("rei.hide.items", hideItems)
}