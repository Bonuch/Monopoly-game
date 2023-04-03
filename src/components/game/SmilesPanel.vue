<template lang="pug">
  div(style="float:right;width:400px;font-size:18px;padding-bottom:5px;")
    //- smiles from here http://modx-gu.ru/html-codes/emoji
    b-button-group(style="width:400px;color:blue;" vertical)
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128513;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128514;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128515;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128516;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128517;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128518;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128519;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128520;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128521;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128522;
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128523;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128524;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128525;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128526;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128527;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128528;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128529;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128530;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128531;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128532;
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128533;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128534;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128535;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128536;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128537;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128538;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128539;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128540;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128541;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128542;
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128543;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128544;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128545;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128546;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128547;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128548;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128549;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128550;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128551;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128552;
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128553;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128554;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128555;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128556;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128557;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128558;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128559;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128560;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128561;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128562;
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128563;
        b-button(@click="insertSmile" style="font-size:20px;width:41px;" size="sm") &#128564;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128565;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128566;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128567;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128568;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128569;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128570;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128571;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128572;
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128573;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128574;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128575;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128576;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128577;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128578;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128579;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128580;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128581;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128582;
      b-button-group
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128583;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128584;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128585;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128586;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128587;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128588;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128589;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128590;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128591;
        b-button(@click="insertSmile" style="font-size:20px" size="sm") &#128592;
</template>

<script>
export default {
  name: 'SmilesPanel',
  data() {
    return {
    }
  },
  props: {
    insertSmile: {
      type: Function,
      default: null
    }
  },
}
</script>

