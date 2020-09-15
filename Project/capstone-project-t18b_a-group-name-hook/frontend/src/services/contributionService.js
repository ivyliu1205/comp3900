import { apiGet, apiPost } from './api'
import {
    getCreatorRecipesSubPath,
    getCreatorRecipeDetailsSubPath,
    // createRecipeSubPath,
    editRecipeSubPath,
    deleteRecipeSubPath,
    updateImagesSubPath
} from '@/config'
import {devConfigUseCreatorRecipeDetails} from "@/dev_config"
import {debugCreatorRecipeDetailsWithoutId} from "@/debug_data"

async function requestGetRecipes() {
    const res = await apiGet(getCreatorRecipesSubPath, true);
    if(res.hasError){
        console.log("Error: get creator recipes");
    } 
    if(devConfigUseCreatorRecipeDetails && res.tryReplaceData([{...debugCreatorRecipeDetailsWithoutId},])) {
        console.log("Use debug");
    }
    return res;
}

async function requestGetRecipeDetail(id) {
    const res = await apiPost(getCreatorRecipeDetailsSubPath, {id: id}, true);
    if(res.hasError){
        console.log(`Error: get creator recipe (ID: ${id})`);
    }

    if(devConfigUseCreatorRecipeDetails && res.tryReplaceData({...debugCreatorRecipeDetailsWithoutId, id: id})) {
        console.log("Use debug");
    }
    return res;
}

// async function requestCreateRecipe() {
//     const res = await apiPost(createRecipeSubPath, true);
//     if(res.hasError){
//         console.log("Error: create recipe");
//     }
//     return res;
// }

async function requestEditRecipe(details) {
    console.log(details.id);
    const res = await apiPost(editRecipeSubPath, details, true);
    if(res.hasError){
        console.log("Error: edit recipe");
    }
    return res;
}
async function requestDeleteRecipe(id) {
    const res = await apiPost(deleteRecipeSubPath, {id:id}, true);
    if(res.hasError){
        console.log(`Error: delete recipe (ID: ${id})`);
    }
    return res;
}

async function requestUpdateImages(id, newImageFiles=[], deletedImageUrls=[]) {
    const data = new FormData();
    data.append("id", id)
    for(const [i, v] of newImageFiles.entries()) {
        data.append(`newimage${i}`,v,v.name)

    }
    for(const [i, v] of deletedImageUrls.entries()) {
        data.append(`deleteimage${i}`,v)

    }

    console.log([...data.keys()]);
    console.log([...data.values()]);
    const res = await apiPost(updateImagesSubPath, data, true, null, {"content-type":"multipart/form-data"});
    
    if(res.hasError){
        console.log(`Error: update recipe images (ID: ${id})`);
    }
    return res;
}

export default {requestGetRecipes, requestGetRecipeDetail, requestEditRecipe, requestDeleteRecipe, requestUpdateImages}
