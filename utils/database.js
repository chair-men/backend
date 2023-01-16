var { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://gtkphlyjmplbzgehjapq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const formatSlotsData = async (data) => {
  const carpark = {};
  carpark.id = data[0].ppcode;
  carpark.name = data[0].ppname;
  carpark.coords = { lat: data[0].lat, lng: data[0].lng };
  carpark.levels = { "1A": [], "1B": [], "2A": [], "2B": [] };
  data.sort((a, b) => a.lotnumber - b.lotnumber);
  for (var lot of data) {
    var c = {};
    c.id = lot.id;
    c.vacant = lot.vacant;
    c.platenumber = lot.platenumber;
    c.lotnumber = lot.lotnumber;
    c.feedback = lot.feedback;
    c.coords = [
      [lot.tlx, lot.tly],
      [lot.brx, lot.bry],
    ];
    carpark.levels[lot.level].push(c);
  }
  return carpark;
};

const formatLevelSlots = (data) => {
  const level = {};
  level.id = data[0].ppcode;
  level.level = data[0].lvl;
  level.levels = { "1A": [], "1B": [], "2A": [], "2B": [] };
  data.sort((a, b) => a.lotnumber - b.lotnumber);
  for (var lot of data) {
    var c = {};
    c.id = lot.id;
    c.vacant = lot.vacant;
    c.platenumber = lot.platenumber;
    c.lotnumber = lot.lotnumber;
    c.feedback = lot.feedback;
    c.coords = [
      [lot.tlx, lot.tly],
      [lot.brx, lot.bry],
    ];
    level.levels[lot.lvl].push(c);
  }
  return level;
};

const getAllCarparks = async () => {
  const { data, error } = await supabase.from("carparks").select("*");
  if (error) {
    return error;
  }
  return data;
};

const getLevelSlotsfromPPCode = async (ppcode, level) => {
  const { data, error } = await supabase
    .from("lv_lots")
    .select("*")
    .match({ ppcode, lvl: level });
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

const setLicensePlate = async (id, platenumber) => {
  const { error } = await supabase
    .from("lots")
    .update({ platenumber: platenumber })
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

const hasLicensePlate = async (id) => {
  const { data, error } = await supabase.from("lots").select("*").match({ id });
  if (error) {
    return error;
  }
  if (data.length == 0) {
    return [];
  }
  return data[0].licenseplate;
};

const giveFeedback = async (id, feedback) => {
  const { data, error: e } = await supabase
    .from("lots")
    .select("*")
    .match({ id });
  if (e) {
    return e;
  }
  var ar = [];
  if (data.feedback) {
    ar = JSON.parse(data.feedback);
  }
  ar.push(feedback);
  console.log(ar);
  const { error } = await supabase
    .from("lots")
    .update({ feedback: ar })
    .eq("id", id);
  if (error) {
    return error;
  }
  return 1;
};

module.exports = {
  supabase,
  getAllCarparks,
  getSlotsfromPPCode,
  getLevelSlotsfromPPCode,
  getVacantSlotsFromPPCode,
  getOccupiedSlotsFromPPCode,
  setOccupied,
  setVacant,
  isVacant,
  hasLicensePlate,
  setLicensePlate,
  giveFeedback,
};
