'use strict';

import * as React from 'react';
import {Web} from '@pnp/sp/presets/all';
import Select from "react-select";
import './custom.css';

const DataGridView = (props: any) => {

  const { context } = props;
  const [siteIdLabel, setsiteIdLabel] = React.useState([]);
  const [filteredDocs, setfilteredDocs] = React.useState([]);
  const [docDetails, setdocDetails] = React.useState([]);
  const [selectedSiteId, setselectedSiteId] = React.useState();
  const [selectedLink, setselectedLink] = React.useState();

  const fetchFav = async() => {
    const web = Web(context.pageContext.site.absoluteUrl);
    const docData: any = await web.lists.getByTitle("Documents").items.select('ReportType,SiteId,FileRef,FileLeafRef,ID').orderBy('SiteId', true).get();
    console.log(docData);
    const uniqueData: string | any[] = [];
    const uniqueDpData: string | any[] = [];
    docData.forEach((element: any) => {
      if(uniqueData.indexOf(element.SiteId) === -1){
        uniqueData.push(element.SiteId);
        uniqueDpData.push({
          value: element.SiteId,
          label: element.SiteId
        });
      }
    });
    setsiteIdLabel(uniqueDpData);
    setdocDetails(docData);
  }

  const changeSiteID = (sd: any) =>{
    console.log(sd);
    setselectedLink(null);
    const filteredDocs: React.SetStateAction<any[]> = [];
    let groupBox: any = [];
    docDetails.forEach((element: any) => {
      let groupLabel: any = [];
      if(element.SiteId === sd.value && groupBox.indexOf(element.ReportType) === -1){
        groupBox.push(element.ReportType);
        docDetails.forEach((innrelement: any) => {
          if(innrelement.ReportType === element.ReportType && innrelement.SiteId === sd.value){
            groupLabel.push({
              value: element.ID,
              label: element.FileLeafRef
            });
          }
        });
        filteredDocs.push({
          label: element.ReportType,
          options: groupLabel
        })
      }
    });
    setfilteredDocs(filteredDocs);
    setselectedSiteId(sd);
  }

  const changeLink = (link: any) =>{
    setselectedLink(link);
    docDetails.forEach((value)=>{
      if(value.ID === link.value){
        window.open(value.FileRef, '_blank');
      }
    })
  }

  React.useEffect(()=>{
    console.log("Grid data");
    fetchFav();
  }, [context]);

  return (
    <div className="coverEntireBox">
      <div className="headingdiv">
        Search Site Documents
      </div>
      <div className="coversiteDocuments">
        <div className='docsdiv1'>
          <Select placeholder="Find site id" options={siteIdLabel} value={selectedSiteId} onChange={changeSiteID} />
        </div>
        <div className='docsdiv2'>
          <Select placeholder="Find documents" options={filteredDocs} value={selectedLink} onChange={changeLink} />
        </div>
      </div>      
    </div>
  );
};

export default DataGridView;
