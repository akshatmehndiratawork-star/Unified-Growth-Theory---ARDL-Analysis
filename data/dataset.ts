export type RawPoint = {
  Year:number; gdpPerCapita:number; fertilityRate:number; expectedSchooling:number; oilRents:number;
};

export const RAW_DATA: RawPoint[] = [
  { Year: 1992, gdpPerCapita: 26709.03, fertilityRate: 5.489, expectedSchooling: 9.515, oilRents: 30.769 },
  { Year: 1993, gdpPerCapita: 25649.06, fertilityRate: 5.326, expectedSchooling: 9.752, oilRents: 29.688 },
  { Year: 1994, gdpPerCapita: 24808.65, fertilityRate: 5.161, expectedSchooling: 9.994, oilRents: 26.548 },
  { Year: 1995, gdpPerCapita: 23876.25, fertilityRate: 4.986, expectedSchooling: 10.243, oilRents: 28.127 },
  { Year: 1996, gdpPerCapita: 23699.14, fertilityRate: 4.812, expectedSchooling: 10.497, oilRents: 33.465 },
  { Year: 1997, gdpPerCapita: 23406.03, fertilityRate: 4.656, expectedSchooling: 10.758, oilRents: 29.278 },
  { Year: 1998, gdpPerCapita: 23179.86, fertilityRate: 4.524, expectedSchooling: 11.026, oilRents: 21.267 },
  { Year: 1999, gdpPerCapita: 22214.43, fertilityRate: 4.354, expectedSchooling: 11.300, oilRents: 27.125 },
  { Year: 2000, gdpPerCapita: 22247.86, fertilityRate: 4.206, expectedSchooling: 11.581, oilRents: 41.669 },
  { Year: 2001, gdpPerCapita: 21193.09, fertilityRate: 3.964, expectedSchooling: 11.869, oilRents: 33.353 },
  { Year: 2002, gdpPerCapita: 20025.43, fertilityRate: 3.709, expectedSchooling: 12.164, oilRents: 31.342 },
  { Year: 2003, gdpPerCapita: 20765.94, fertilityRate: 3.465, expectedSchooling: 12.466, oilRents: 37.035 },
  { Year: 2004, gdpPerCapita: 21545.89, fertilityRate: 3.264, expectedSchooling: 12.776, oilRents: 42.641 },
  { Year: 2005, gdpPerCapita: 21838.19, fertilityRate: 3.161, expectedSchooling: 13.094, oilRents: 48.861 },
  { Year: 2006, gdpPerCapita: 21616.34, fertilityRate: 3.176, expectedSchooling: 12.900, oilRents: 49.670 },
  { Year: 2007, gdpPerCapita: 21196.79, fertilityRate: 3.185, expectedSchooling: 12.707, oilRents: 47.439 },
  { Year: 2008, gdpPerCapita: 21629.84, fertilityRate: 3.074, expectedSchooling: 12.762, oilRents: 54.086 },
  { Year: 2009, gdpPerCapita: 20577.55, fertilityRate: 2.950, expectedSchooling: 12.818, oilRents: 34.632 },
  { Year: 2010, gdpPerCapita: 21830.14, fertilityRate: 2.810, expectedSchooling: 13.014, oilRents: 37.901 },
  { Year: 2011, gdpPerCapita: 23314.56, fertilityRate: 2.800, expectedSchooling: 13.210, oilRents: 49.161 },
  { Year: 2012, gdpPerCapita: 23643.04, fertilityRate: 2.780, expectedSchooling: 13.406, oilRents: 47.409 },
  { Year: 2013, gdpPerCapita: 23057.35, fertilityRate: 2.670, expectedSchooling: 13.602, oilRents: 44.456 },
  { Year: 2014, gdpPerCapita: 23404.73, fertilityRate: 2.680, expectedSchooling: 14.398, oilRents: 40.322 },
  { Year: 2015, gdpPerCapita: 23256.15, fertilityRate: 2.630, expectedSchooling: 14.769, oilRents: 23.957 },
  { Year: 2016, gdpPerCapita: 22783.03, fertilityRate: 2.650, expectedSchooling: 15.140, oilRents: 20.005 },
  { Year: 2017, gdpPerCapita: 23035.12, fertilityRate: 2.670, expectedSchooling: 15.725, oilRents: 23.617 },
  { Year: 2018, gdpPerCapita: 24393.52, fertilityRate: 2.670, expectedSchooling: 15.856, oilRents: 28.084 },
  { Year: 2019, gdpPerCapita: 24905.67, fertilityRate: 2.490, expectedSchooling: 15.983, oilRents: 24.330 },
  { Year: 2020, gdpPerCapita: 22827.67, fertilityRate: 2.270, expectedSchooling: 15.760, oilRents: 15.979 },
  { Year: 2021, gdpPerCapita: 24922.67, fertilityRate: 2.170, expectedSchooling: 15.769, oilRents: 23.686 },
  { Year: 2022, gdpPerCapita: 26706.92, fertilityRate: 2.140, expectedSchooling: 16.949, oilRents: 23.250 },
  { Year: 2023, gdpPerCapita: 25634.82, fertilityRate: 2.280, expectedSchooling: 16.949, oilRents: 24.960 }
];



export const ADF_RESULTS = [
 {variable:'Δ GDP per capita', statistic:-6.767538, p:0.0000, order:'I(1)'},
 {variable:'Δ Expected years of schooling', statistic:-4.974511, p:0.0019, order:'I(1)'},
 {variable:'Δ Fertility rate', statistic:-4.034111, p:0.0187, order:'I(1)'},
 {variable:'Δ Oil rents', statistic:-5.525972, p:0.0005, order:'I(1)'}
];

export const BREAKS = [
 {variable:'GDP per capita', breaks:['1999','2019'], statistic:-7.9259, critical5:-5.9170, decision:'Reject H₀ at 1%', confirmed:true},
 {variable:'Expected years of schooling', breaks:['2004','2012'], statistic:-5.0285, critical5:-6.2880, decision:'Cannot reject H₀', confirmed:false},
 {variable:'Fertility rate', breaks:['1999','2017'], statistic:-4.3170, critical5:-6.1520, decision:'Cannot reject H₀', confirmed:false},
 {variable:'Oil rents', breaks:['2008','2013'], statistic:-7.3278, critical5:-6.4460, decision:'Reject H₀ at 1%', confirmed:true}
];

export const LONG_RUN = [
 {name:'Fertility rate', coefficient:10348.39, se:2948.31, t:3.509, p:0.0027},
 {name:'Expected years of schooling', coefficient:-602.4398, se:685.201, t:-0.879, p:0.3915},
 {name:'Oil rents', coefficient:161.4387, se:53.998, t:2.990, p:0.0082}
];

export const SHORT_RUN = [
 {name:'Δ GDP per capita(-1)', coefficient:0.624, se:0.218, t:2.853, p:0.0095},
 {name:'Δ Expected schooling', coefficient:191.496, se:347.761, t:0.551, p:0.5877},
 {name:'Δ Fertility', coefficient:6175.363, se:1807.628, t:3.416, p:0.0026},
 {name:'Δ Fertility(-1)', coefficient:-3956.465, se:1789.262, t:-2.211, p:0.0382},
 {name:'Δ Fertility(-2)', coefficient:-10204.830, se:1636.206, t:-6.237, p:0.0000},
 {name:'Δ Oil rents', coefficient:97.926, se:12.806, t:7.647, p:0.0000},
 {name:'Δ Oil rents(-1)', coefficient:-64.665, se:21.811, t:-2.965, p:0.0074}
];

export const DIAGNOSTICS = [
 {name:'Breusch–Godfrey LM', statistic:0.280852, p:0.8383, conclusion:'No evidence of serial correlation'},
 {name:'Breusch–Pagan–Godfrey', statistic:0.604151, p:0.8009, conclusion:'No evidence of heteroskedasticity'},
 {name:'Jarque–Bera', statistic:0.883972, p:0.642759, conclusion:'No evidence against normality'},
 {name:'Ramsey RESET', statistic:0.195913, p:0.8974, conclusion:'No evidence of functional-form misspecification'}
];

export const MODEL_STATS = {r2:0.8878, adjR2:0.8503, f:23.72612, fP:0, dw:2.041733, ect:-1.383761, ectT:-5.797, ectP:0};
export const BOUNDS = {f:5.441751, i0:3.272, i1:4.306};

export function firstDifference(key:keyof RawPoint){
 const out:any[]=[];
 for(let i=1;i<RAW_DATA.length;i++) out.push({Year:RAW_DATA[i].Year,[key]:RAW_DATA[i][key]-RAW_DATA[i-1][key]});
 return out;
}
