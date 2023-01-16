var { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://gtkphlyjmplbzgehjapq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const formatSlotsData = async (data) => {
  const carpark = {};
  carpark.id = data[0].ppcode;
  carpark.name = data[0].ppname;
  carpark.coords = { lat: data[0].lat, lng: data[0].lng };
  carpark.levels = [[], [], []];
  data.sort((a, b) => a.lotnumber - b.lotnumber);
  for (var lot of data) {
    var c = {};
    c.id = lot.id;
    c.vacant = lot.vacant;
    c.platenumber = lot.platenumber;
    carpark.levels[lot.level - 1].push(c);
    c.lotnumber = lot.lotnumber;
  }
  return carpark;
};

const formatLevelSlots = (data) => {
  const level = {};
  level.id = data[0].ppcode;
  level.level = data[0].level;
  level.coords = { lat: data[0].lat, lng: data[0].lng };
  level.lots = [];
  data.sort((a, b) => a.lotnumber - b.lotnumber);
  for (var lot of data) {
    var c = {};
    c.id = lot.id;
    c.vacant = lot.vacant;
    c.platenumber = lot.platenumber;
    c.lotnumber = lot.lotnumber;
    level.lots.push(c);
  }
  return level;
};

const getLevelSlotsfromPPCode = async (ppcode, level) => {
  const { data, error } = await supabase
    .from("lv_lots")
    .select("*")
    .match({ ppcode, level });
  if (error) {
    return error;
  }
  return formatLevelSlots(data);
};
const getSlotsfromPPCode = async (ppcode) => {
  const { data, error } = await supabase
    .from("cp_lots")
    .select("*")
    .match({ ppcode });
  if (error) {
    return error;
  }
  return formatSlotsData(data);
};

const getVacantSlotsFromPPCode = async (ppcode) => {
  const { data, error } = await supabase
    .from("cp_lots")
    .select("*")
    .match({ ppcode, vacant: true });
  if (error) {
    return error;
  }
  return formatSlotsData(data);
};

const getOccupiedSlotsFromPPCode = async (ppcode) => {
  const { data, error } = await supabase
    .from("cp_lots")
    .select("*")
    .match({ ppcode, vacant: false });
  if (error) {
    return error;
  }
  return formatSlotsData(data);
};

const setOccupied = async (id) => {
  const { error } = await supabase
    .from("lots")
    .update({ vacant: false })
    .match({ id });
  if (error) {
    return error;
  }
  return 1;
};

const setVacant = async (id) => {
  const { error } = await supabase
    .from("lots")
    .update({ vacant: true, platenumber: null })
    .match({ id });
  if (error) {
    return error;
  }
  return 1;
};

const isVacant = async (id) => {
  const { data, error } = await supabase.from("lots").select("*").match({ id });
  if (error) {
    return error;
  }
  if (data.length == 0) {
    return [];
  }
  return data[0].vacant;
};

module.exports = {
  supabase,
  getSlotsfromPPCode,
  getLevelSlotsfromPPCode,
  getVacantSlotsFromPPCode,
  getOccupiedSlotsFromPPCode,
  setOccupied,
  setVacant,
  isVacant,
};
