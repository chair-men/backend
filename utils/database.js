var { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://gtkphlyjmplbzgehjapq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const formatSlotsData = async (data) => {
  if (data.length == 0) {
    return [];
  }
  const carpark = {};
  carpark.id = data[0].ppcode;
  carpark.name = data[0].ppname;
  carpark.renovation = data[0].renovation;
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
  carpark.status = { "1A": {}, "1B": {}, "2A": {}, "2B": {} };
  for (var k of Object.keys(carpark.status)) {
    const count = 40;
    carpark.status[k]["vacant"] = carpark.levels[k].length;
    carpark.status[k]["occupied"] = count - carpark.levels[k].length;
  }

  return carpark;
};

const formatLevelSlots = (data) => {
  if (data.length == 0) {
    return [];
  }
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

const getSlotFromLicensePlate = async (licenseplate) => {
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .match({ platenumber: licenseplate });
    if (error)
      return error;
    return data[0];
}

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
    .eq("id", id);
  if (e) {
    return e;
  }
  var ar = [];
  if (data[0]?.feedback) {
    ar = data[0].feedback;
  }
  ar.push(feedback);
  ar = ar.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          JSON.parse(t).image === JSON.parse(value).image &&
          JSON.parse(t).other === JSON.parse(value).other
      )
  );
  const { error } = await supabase
    .from("lots")
    .update({ feedback: ar })
    .eq("id", id);
  if (error) {
    return error;
  }
  return 1;
};

const getFeedback = async (id) => {
  const { data, error: e } = await supabase
    .from("lots")
    .select("*")
    .eq("id", id);
  if (e) {
    return e;
  }
  var ar = [];
  if (data[0]?.feedback) {
    ar = JSON.parse(JSON.stringify(data[0].feedback));
    for (var i = 0; i < ar.length; i++) {
      ar[i] = JSON.parse(ar[i]);
    }
  }
  return ar;
};

module.exports = {
  supabase,
  getAllCarparks,
  getSlotsfromPPCode,
  getLevelSlotsfromPPCode,
  getVacantSlotsFromPPCode,
  getSlotFromLicensePlate,
  // getOccupiedSlotsFromPPCode,
  getOccupiedSlotsFromPPCode,
  setOccupied,
  setVacant,
  isVacant,
  hasLicensePlate,
  setLicensePlate,
  giveFeedback,
  getFeedback,
};
