function int_to_hex(num: number) {
  var hex = Math.round(num).toString(16);
  if (hex.length == 1) hex = "0" + hex;
  return hex;
}

export function blend_colors(
  color1: string,
  color2: string,
  percentage: number
) {
  percentage = percentage;

  // 1: validate input, make sure we have provided a valid hex
  if (color1.length != 4 && color1.length != 7)
    throw new Error("colors must be provided as hexes");

  if (color2.length != 4 && color2.length != 7)
    throw new Error("colors must be provided as hexes");

  if (percentage > 1 || percentage < 0)
    throw new Error("percentage must be between 0 and 1");

  // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
  //      the three character hex is just a representation of the 6 hex where each character is repeated
  //      ie: #060 => #006600 (green)
  if (color1.length == 4)
    color1 =
      color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
  else color1 = color1.substring(1);
  if (color2.length == 4)
    color2 =
      color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
  else color2 = color2.substring(1);

  // 3: we have valid input, convert colors to rgb
  const rgbColor1 = [
    parseInt(color1[0] + color1[1], 16),
    parseInt(color1[2] + color1[3], 16),
    parseInt(color1[4] + color1[5], 16)
  ];
  const rgbColor2 = [
    parseInt(color2[0] + color2[1], 16),
    parseInt(color2[2] + color2[3], 16),
    parseInt(color2[4] + color2[5], 16)
  ];

  // 4: blend
  const rgbColor3 = [
    (1 - percentage) * rgbColor1[0] + percentage * rgbColor2[0],
    (1 - percentage) * rgbColor1[1] + percentage * rgbColor2[1],
    (1 - percentage) * rgbColor1[2] + percentage * rgbColor2[2]
  ];

  // 5: convert to hex
  const color3 =
    "#" +
    int_to_hex(rgbColor3[0]) +
    int_to_hex(rgbColor3[1]) +
    int_to_hex(rgbColor3[2]);

  return color3;
}
