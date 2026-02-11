import { RegionEnum } from "../enums/region-enum";
import { LocationMapType } from "../types/location.type";

export const LocationMap: LocationMapType[] = [
    {
        region: RegionEnum.VINNYTSIA,
        cities: [
            "Вінниця",
            "Жмеринка",
            "Могилів-Подільський",
            "Гайсин",
            "Козятин",
        ],
    },
    {
        region: RegionEnum.VOLYN,
        cities: ["Луцьк", "Ковель", "Нововолинськ", "Володимир", "Ківерці"],
    },
    {
        region: RegionEnum.DNIPROPETROVSK,
        cities: ["Дніпро", "Кривий Ріг", "Кам'янське", "Нікополь", "Павлоград"],
    },
    {
        region: RegionEnum.DONETSK,
        cities: [
            "Донецьк",
            "Маріуполь",
            "Макіївка",
            "Краматорськ",
            "Слов'янськ",
        ],
    },
    {
        region: RegionEnum.ZHYTOMYR,
        cities: ["Житомир", "Бердичів", "Коростень", "Звягель", "Малин"],
    },
    {
        region: RegionEnum.ZAKARPATTIA,
        cities: ["Ужгород", "Мукачево", "Хуст", "Виноградів", "Берегове"],
    },
    {
        region: RegionEnum.ZAPORIZHZHIA,
        cities: ["Запоріжжя", "Мелітополь", "Бердянськ", "Енергодар", "Токмак"],
    },
    {
        region: RegionEnum.IVANO_FRANKIVSK,
        cities: ["Івано-Франківськ", "Калуш", "Коломия", "Надвірна", "Долина"],
    },
    {
        region: RegionEnum.KYIV,
        cities: ["Київ", "Біла Церква", "Бровари", "Бориспіль", "Ірпінь"],
    },
    {
        region: RegionEnum.KIROVOHRAD,
        cities: [
            "Кропивницький",
            "Олександрія",
            "Світловодськ",
            "Знам'янка",
            "Долинська",
        ],
    },
    {
        region: RegionEnum.LUHANSK,
        cities: [
            "Луганськ",
            "Сєвєродонецьк",
            "Алчевськ",
            "Лисичанськ",
            "Хрустальний",
        ],
    },
    {
        region: RegionEnum.LVIV,
        cities: ["Львів", "Дрогобич", "Червоноград", "Стрий", "Самбір"],
    },
    {
        region: RegionEnum.MYKOLAIV,
        cities: [
            "Миколаїв",
            "Первомайськ",
            "Южноукраїнськ",
            "Вознесенськ",
            "Новий Буг",
        ],
    },
    {
        region: RegionEnum.ODESA,
        cities: [
            "Одеса",
            "Ізмаїл",
            "Чорноморськ",
            "Білгород-Дністровський",
            "Подільськ",
        ],
    },
    {
        region: RegionEnum.POLTAVA,
        cities: ["Полтава", "Кременчук", "Горішні Плавні", "Лубни", "Миргород"],
    },
    {
        region: RegionEnum.RIVNE,
        cities: ["Рівне", "Вараш", "Дубно", "Костопіль", "Сарни"],
    },
    {
        region: RegionEnum.SUMY,
        cities: ["Суми", "Конотоп", "Шостка", "Охтирка", "Ромни"],
    },
    {
        region: RegionEnum.TERNOPIL,
        cities: ["Тернопіль", "Чортків", "Кременець", "Бережани", "Теребовля"],
    },
    {
        region: RegionEnum.KHARKIV,
        cities: ["Харків", "Лозова", "Ізюм", "Чугуїв", "Первомайський"],
    },
    {
        region: RegionEnum.KHERSON,
        cities: ["Херсон", "Нова Каховка", "Каховка", "Олешки", "Скадовськ"],
    },
    {
        region: RegionEnum.KHMELNYTSKYI,
        cities: [
            "Хмельницький",
            "Кам'янець-Подільський",
            "Шепетівка",
            "Нетішин",
            "Славута",
        ],
    },
    {
        region: RegionEnum.CHERKASY,
        cities: ["Черкаси", "Умань", "Сміла", "Золотоноша", "Канів"],
    },
    {
        region: RegionEnum.CHERNIVTSI,
        cities: [
            "Чернівці",
            "Сторожинець",
            "Новодністровськ",
            "Хотин",
            "Сокиряни",
        ],
    },
    {
        region: RegionEnum.CHERNIHIV,
        cities: ["Чернігів", "Ніжин", "Прилуки", "Бахмач", "Носівка"],
    },
    {
        region: RegionEnum.CRIMEA,
        cities: ["Сімферополь", "Севастополь", "Керч", "Євпаторія", "Ялта"],
    },
] as const;
