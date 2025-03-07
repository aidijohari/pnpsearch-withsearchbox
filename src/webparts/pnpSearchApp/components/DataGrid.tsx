'use strict';

import * as React from 'react';
import {Web} from '@pnp/sp/presets/all';
import Select from "react-select";
import './custom.css';

const DataGridView = (props: any) => {

  const { context } = props;
  const [siteIdLabel, setsiteIdLabel] = React.useState([]);
  const [filteredDocs, setfilteredDocs] = React.useState([]);
  const [filteredbackupDocs, setfilteredbackupDocs] = React.useState([]);
  const [docDetails, setdocDetails] = React.useState([]);
  const [showDropdown, setshowDropdown] = React.useState(false);
  const [backup, setbackup] = React.useState([]);
  // const [searchText, setsearchText] = React.useState('');
  const [selectedSiteId, setselectedSiteId] = React.useState();
  const [selectedSiteIdText, setselectedSiteIdText] = React.useState('');
  const [selectedLink, setselectedLink] = React.useState('Find documents');

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
    console.log(filteredDocs);

  }

  const changeSiteID = (sd: any) =>{
    console.log(sd);
    setshowDropdown(false);
    setselectedLink('Find documents');
    const filteredDocs1: React.SetStateAction<any[]> = [];
    let groupBox: any = [];
    setbackup(docDetails);
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
        filteredDocs1.push({
          label: element.ReportType,
          options: groupLabel
        })
      }
    });
    setfilteredDocs(filteredDocs1);
    setfilteredbackupDocs(filteredDocs1);
    console.log(selectedLink)
    setselectedSiteId(sd);
    setselectedSiteIdText(sd.value);
  }

  const changeLink = (link: any) =>{
    docDetails.forEach((value)=>{
      if(value.ID === link.value){
        setselectedLink(value.FileLeafRef);
        setshowDropdown(false);
        setfilteredDocs(filteredbackupDocs);
        window.open(value.FileRef, '_blank');
      }
    })
  }

  const searchContent = (e: any) => {
    // setsearchText(e.currentTarget.value);
    const filteredDocs2: React.SetStateAction<any[]> = [];
    let groupBox: any = [];
    if(e.currentTarget.value !== ""){
      backup.forEach((element: any) => {
        let groupLabel: any = [];
        if(element.SiteId === selectedSiteIdText && groupBox.indexOf(element.ReportType) === -1 && element.FileLeafRef.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) !== -1){
          groupBox.push(element.ReportType);
          backup.forEach((innrelement: any) => {
            if(innrelement.ReportType === element.ReportType && innrelement.SiteId === selectedSiteIdText){
              groupLabel.push({
                value: element.ID,
                label: element.FileLeafRef
              });
            }
          });
          filteredDocs2.push({
            label: element.ReportType,
            options: groupLabel
          })
        }
      });
      setfilteredDocs(filteredDocs2);
    }
    else{
      setfilteredDocs(filteredbackupDocs);
    }
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
          <div className='dropdownParent' onClick={()=>{setshowDropdown(!showDropdown)}}>
            {selectedLink}
            <div className="dropdownarrowparent">
            <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
            <path xmlns="http://www.w3.org/2000/svg" d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#cccccc"/>
            </svg>
            </div>
          </div>
          { showDropdown && 
            <div className="dropdownCover">
              <div className="dropdownSearch">
                <input type="text" name="" id="" onKeyUp={(e)=>searchContent(e)} className="dropdownInput" />
                <div className="searchicon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 488.4 488.4">
                    <g>
                      <g>
                        <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6    s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2    S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7    S381.9,104.65,381.9,203.25z"/>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="dropdownContentCover">
                {filteredDocs.map((value: any)=>{
                  return(
                    <>
                      <div className="dropdownContentHeading">
                        {value.label}
                      </div>
                      {value.options.map((innerval: any)=>{
                        return(
                          <div className="dropdownContentBody" onClick={()=>changeLink(innerval)}>
                            {innerval.label}
                          </div>
                        )
                      })}
                      
                    </>
                  )
                })}
                
              </div>
            </div>
          }
          {/* <Select placeholder="Find documents" onClick={()=>{alert("Test");setshowDropdown(true);}} value={selectedLink} onChange={changeLink} /> */}
        </div>
      </div>      
    </div>
  );
};

export default DataGridView;
