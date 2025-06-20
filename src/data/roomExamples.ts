import type { Room, RoomData } from "@/types/room.ts";

const simpleRoom: Room = {
    "walls": [
        { "id": "2d15090c-3b12-ce96-f716-633fa9d695a9" },
        { "id": "2d07777e-a3ab-6340-daad-fb7d9dae2963" },
        { "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" },
        { "id": "9e31ad3e-246b-21e6-2f20-0086d6e6c7b1" }
    ],
    "corners": [
        {
            "id": "e381789d-72ff-a676-4da1-fafdf88516b7",
            "x": -1405.128,
            "y": 393.192,
            "wallStarts": [{ "id": "2d15090c-3b12-ce96-f716-633fa9d695a9" }],
            "wallEnds": [{ "id": "9e31ad3e-246b-21e6-2f20-0086d6e6c7b1" }]
        },
        {
            "id": "7bb551a1-3563-a01e-f0d3-dbee123189ca",
            "x": -990.5999999999999,
            "y": 393.192,
            "wallStarts": [{ "id": "2d07777e-a3ab-6340-daad-fb7d9dae2963" }],
            "wallEnds": [{ "id": "2d15090c-3b12-ce96-f716-633fa9d695a9" }]
        },
        {
            "id": "47e4aeaf-8c54-5303-acbb-c434a7fe7987",
            "x": -818.5573333333334,
            "y": -255.016,
            "wallStarts": [{ "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" }],
            "wallEnds": [{ "id": "2d07777e-a3ab-6340-daad-fb7d9dae2963" }]
        },
        {
            "id": "df0bbbd1-fa58-6a0a-7c12-2a9f4d9658fa",
            "x": -1405.128,
            "y": -255.016,
            "wallStarts": [{ "id": "9e31ad3e-246b-21e6-2f20-0086d6e6c7b1" }],
            "wallEnds": [{ "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" }]
        }
    ]
}

const tShapeRoom: Room = {
    "walls": [
        { "id": "2d07777e-a3ab-6340-daad-fb7d9dae2963" },
        { "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" },
        { "id": "9e31ad3e-246b-21e6-2f20-0086d6e6c7b1" },
        { "id": "4f87455c-ac39-4e7b-d8a5-ea2b57efbaca" },
        { "id": "23106663-68e5-a0ad-79b4-ee6948a422ea" },
        { "id": "b00d70b4-397f-b107-8856-bc4b5b7e51ce" },
        { "id": "987e3d9a-c70a-f2ea-0992-961e12a250dc" },
        { "id": "a17e4504-0eee-a5f0-51dc-293ea3499195" }
    ],
    "corners": [
        {
            "id": "b4a4c5f6-59c2-15c0-d7b5-ba31e9912d76",
            "x": -1405.128,
            "y": 12.078207999999911,
            "wallStarts": [{ "id": "b00d70b4-397f-b107-8856-bc4b5b7e51ce" }],
            "wallEnds": [{ "id": "9e31ad3e-246b-21e6-2f20-0086d6e6c7b1" }]
        },
        {
            "id": "7bb551a1-3563-a01e-f0d3-dbee123189ca",
            "x": -990.5999999999999,
            "y": 393.192,
            "wallStarts": [{ "id": "2d07777e-a3ab-6340-daad-fb7d9dae2963" }],
            "wallEnds": [{ "id": "23106663-68e5-a0ad-79b4-ee6948a422ea" }]
        },
        {
            "id": "4f429b40-74ef-809b-5fb2-a102139f0aec",
            "x": -990.5999999999999,
            "y": 14.110207999999943,
            "wallStarts": [{ "id": "987e3d9a-c70a-f2ea-0992-961e12a250dc" }
            ],
            "wallEnds": [{ "id": "2d07777e-a3ab-6340-daad-fb7d9dae2963" }]
        },
        {
            "id": "0ec8a82d-67ed-3875-2722-7295090af9cf",
            "x": -818.5573333333334,
            "y": 14.110207999999943,
            "wallStarts": [{ "id": "a17e4504-0eee-a5f0-51dc-293ea3499195" }],
            "wallEnds": [{ "id": "987e3d9a-c70a-f2ea-0992-961e12a250dc" }]
        },
        {
            "id": "47e4aeaf-8c54-5303-acbb-c434a7fe7987",
            "x": -818.5573333333334,
            "y": -255.016,
            "wallStarts": [{ "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" }],
            "wallEnds": [{ "id": "a17e4504-0eee-a5f0-51dc-293ea3499195" }]
        },
        {
            "id": "df0bbbd1-fa58-6a0a-7c12-2a9f4d9658fa",
            "x": -1405.128,
            "y": -255.016,
            "wallStarts": [{ "id": "9e31ad3e-246b-21e6-2f20-0086d6e6c7b1" }],
            "wallEnds": [{ "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" }]
        },
        {
            "id": "52b045fe-9753-81ca-984c-ac18d999ea7d",
            "x": -1240.5359999999998,
            "y": 12.078207999999911,
            "wallStarts": [{ "id": "4f87455c-ac39-4e7b-d8a5-ea2b57efbaca" }],
            "wallEnds": [{ "id": "b00d70b4-397f-b107-8856-bc4b5b7e51ce" }]
        },
        {
            "id": "e3875084-5db2-2c5f-10dc-70fd5fe082bf",
            "x": -1240.5359999999998,
            "y": 393.192,
            "wallStarts": [{ "id": "23106663-68e5-a0ad-79b4-ee6948a422ea" }],
            "wallEnds": [{ "id": "4f87455c-ac39-4e7b-d8a5-ea2b57efbaca" }]
        }
    ]
}

const triangleRoom: Room = {
    "walls": [
        { "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" },
        { "id": "4f87455c-ac39-4e7b-d8a5-ea2b57efbaca" },
        { "id": "23106663-68e5-a0ad-79b4-ee6948a422ea" }
    ],
    "corners": [
        {
            "id": "7bb551a1-3563-a01e-f0d3-dbee123189ca",
            "x": -817.9233493333329,
            "y": -255.016,
            "wallStarts": [{ "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" }],
            "wallEnds": [{ "id": "23106663-68e5-a0ad-79b4-ee6948a422ea" }]
        },
        {
            "id": "52b045fe-9753-81ca-984c-ac18d999ea7d",
            "x": -1439.2098284277688,
            "y": -86.44905107879798,
            "wallStarts": [{ "id": "4f87455c-ac39-4e7b-d8a5-ea2b57efbaca" }],
            "wallEnds": [{ "id": "5021e32a-87e8-f5e2-0ee6-53bc49cd7d25" }]
        },
        {
            "id": "e3875084-5db2-2c5f-10dc-70fd5fe082bf",
            "x": -1240.5359999999998,
            "y": 393.192,
            "wallStarts": [{ "id": "23106663-68e5-a0ad-79b4-ee6948a422ea" }],
            "wallEnds": [{ "id": "4f87455c-ac39-4e7b-d8a5-ea2b57efbaca" }]
        }
    ]
}

const roomData: RoomData = {
    simpleRoom,
    tShapeRoom,
    triangleRoom,
}

export default roomData;
