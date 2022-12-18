import React, { useEffect, useState } from 'react';
import { Festival } from './API/types';
import './App.css';

type BandRecordLabelsMap = Map<string, Map<string, Set<string>>>;

const fetchData = async () => {
  let bandRecordLabelsMap: BandRecordLabelsMap = new Map<string, Map<string, Set<string>>>();
  try {
    const response = await fetch("https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals");
    const festivals: Festival[] = await response.json();
    // const festivals: Festival[] = [{ "name": "LOL-palooza", "bands": [{ "name": "Winter Primates", "recordLabel": "" }, { "name": "Frank Jupiter", "recordLabel": "Pacific Records" }, { "name": "Jill Black", "recordLabel": "Fourth Woman Records" }, { "name": "Werewolf Weekday", "recordLabel": "XS Recordings" }] }, { "name": "Twisted Tour", "bands": [{ "name": "Summon", "recordLabel": "Outerscope" }, { "name": "Auditones", "recordLabel": "Marner Sis. Recording" }, { "name": "Squint-281" }] }, { "name": "Small Night In", "bands": [{ "name": "Yanke East", "recordLabel": "MEDIOCRE Music" }, { "name": "Green Mild Cold Capsicum", "recordLabel": "Marner Sis. Recording" }, { "name": "The Black Dashes", "recordLabel": "Fourth Woman Records" }, { "name": "Squint-281", "recordLabel": "Outerscope" }, { "name": "Wild Antelope", "recordLabel": "Marner Sis. Recording" }] }, { "name": "Zrainerella", "bands": [{ "name": "Manish Ditch", "recordLabel": "ACR" }] }, { "name": "Trainerella", "bands": [{ "name": "Manish Ditch", "recordLabel": "ACR" }, { "name": "YOUKRANE", "recordLabel": "Anti Records" }, { "name": "Adrian Venti", "recordLabel": "Monocracy Records" }, { "name": "Wild Antelope", "recordLabel": "Still Bottom Records" }] }, { "bands": [{ "name": "Critter Girls", "recordLabel": "ACR" }, { "name": "Propeller", "recordLabel": "Pacific Records" }] }];
    if (festivals.length === 0) {
      return null;
    }
    festivals.forEach(festival => {
      festival.bands.forEach(band => {
        const recordLabel = band.recordLabel || 'Unknown Band Record';
        let bandMap = bandRecordLabelsMap.get(recordLabel) ?? new Map<string, Set<string>>();
        const festivalSet = bandMap.get(band.name) ?? new Set<string>();
        if (festival.name) {
          festivalSet.add(festival.name);
        }
        bandMap.set(band.name, festivalSet);
        bandRecordLabelsMap.set(recordLabel, bandMap);
      });
    });
    bandRecordLabelsMap = sortRecords(bandRecordLabelsMap);
    return bandRecordLabelsMap;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const sortRecords = (bandRecordLabelsMap: BandRecordLabelsMap) => {
  // sort record labels
  bandRecordLabelsMap = new Map([...bandRecordLabelsMap].sort());
  for (const [recordLabel, bandMap] of bandRecordLabelsMap) {
    // sort band names
    const sortedBandMap = new Map([...bandMap].sort());
    for (const [bandName, festivalsSet] of sortedBandMap) {
      // sort festival names
      const sortedFestivalSet = [...festivalsSet].sort();
      sortedBandMap.set(bandName, new Set(sortedFestivalSet));
    }
    bandRecordLabelsMap.set(recordLabel, sortedBandMap);
  }
  return bandRecordLabelsMap;
}

function App() {
  const [bandRecordLabelsMap, setBandRecordLabelsMap] = useState<BandRecordLabelsMap | null>();
  useEffect(() => {
    (async () => {
      const records = await fetchData();
      setBandRecordLabelsMap(records);
    })();
  }, [])

  return (
    <div className="App">
      {
        bandRecordLabelsMap ?
          Array.from(bandRecordLabelsMap).map(recordLabel => {
            return <div className='label' key={recordLabel[0]}>
              {
                recordLabel[0]
              }
              <div className='label'>
                {Array.from(recordLabel[1]).map(bandMap => {
                  return (<div className='label' key={bandMap[0]}>
                    {bandMap[0]}
                    {
                      Array.from(bandMap[1]).map(festival => {
                        return <div className='label' key={festival}>{festival}</div>
                      })
                    }
                  </div>
                  )
                })}
              </div>
            </div>
          }) : 'Festival records not available'
      }
    </div>
  );
}

export default App;
