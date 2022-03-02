import api from "@/api";

const getTags = (context) => {
  api.getUrl(context, "/tags", "TAGS_UPDATED");
};

const getTag = (context, id) => {
  api.getUrl(context, "/tags/" + id, "TAG_UPDATED");
};

const searchTags = (context, filter) => {
  api.getUrl(context, "/tags?" + filter, "TAGS_UPDATED");
};

const createTag = (context, payload) => {
  api.postUrl(context, "/tags", payload, "TAGS_UPDATED");
};

const updateTag = (context, payload) => {
  api.patchUrl(context, "/tags/" + payload.id, payload, "TAG_UPDATED");
};

const deleteTag = (context, id) => {
  api.deleteUrl(context, "/tags/" + id, "TAG_RESET");
};

const resetTag = (context) => {
  context.commit("TAG_RESET");
};

export default {
  getTags,
  searchTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  resetTag,
};
