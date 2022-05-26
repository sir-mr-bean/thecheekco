import Shippo from "shippo";
const shippo = new Shippo(process.env.SHIPPO_TOKEN);

export default async function handler(req, res) {
  console.log(req.body);
  shippo.shipment
    .create({
      address_from: {
        name: "Amrinder Kamboj",
        company: "Xprofulfill",
        street1: "413 Riverside suite D",
        city: "Modesto",
        state: "CA",
        zip: "95354",
        country: "US", //iso2 country code
        phone: "+1 209 456 5949",
      },
      address_to: {
        name: "alicia",
        street1: "1516 W Ash St",
        city: "Griffith",
        state: "IN",
        zip: "46319",
        country: "US",
      },
      parcels: [
        {
          distance_unit: "in",
          mass_unit: "lb",
          width: req.body.width,
          height: req.body.height,
          length: req.body.length,
          weight: req.body.weight,
        },
      ],
    })
    .then((response) => {
      console.log(response);
      let rate_list = [];
      for (i of response.rates) {
        rate_list.push(i.amount);
      }
      let list = response.rates;
      let smallest = 100;
      for (i of list) {
        if (smallest > i.amount) {
          smallest = i.amount;
        }
      }
      res
        .status(200)
        .send(
          `<label><cost>${smallest}</cost><service>${
            response.rates[rate_list.indexOf(smallest)].servicelevel.token
          }</service></label>`
        );
    });
}
