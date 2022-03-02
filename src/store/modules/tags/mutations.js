const TAGS_UPDATED = (state, tags) => {
  state.tags = tags.data;
};

const TAG_UPDATED = (state, tag) => {
  state.tag = tag.data;
};

const TAG_RESET = (state) => {
  state.tag = null;
};

export default {
  TAGS_UPDATED,
  TAG_UPDATED,
  TAG_RESET,
};
