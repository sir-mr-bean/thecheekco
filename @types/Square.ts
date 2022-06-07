export type category = {
  type: string;
  id: string;
  is_deleted: Boolean;
  present_at_all_locations: Boolean;
  updated_at: string;
  version: number;
  category_v1_ids: [{ catalog_v1_id: string; location_id: string }];
  category_data: {
    name: string;
    ordinal: number;
  };
};

export type product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: category;
  variations: [
    {
      created_at: string;
      custom_attribute_values: unknown;
      id: string;
      is_deleted: Boolean;
      item_variation_data: {
        name: string;
        ordinal: number;
        item_id: string;
        location_overrides: [
          {
            location_id: string;
            track_inventory: Boolean;
          }
        ];
        price_money: {
          amount: number;
          currency: string;
        };
        pricing_type: string;
        sellable: Boolean;
        stockable: Boolean;
        track_inventory: Boolean;
      };
      updated_at: string;
      version: number;
      type: string;
      present_at_all_locations: Boolean;
      present_at_location_ids: [string];
    }
  ];
};
