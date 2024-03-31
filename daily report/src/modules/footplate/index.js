import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from 'xlsx';

import 'antd/dist/reset.css';
import UploadComponent from "../../component/upload-component";
import { Button, DatePicker } from "antd";
const Footplate = () => {
    const [footplate, setFootplate] = useState([])
    const [nightDuty, setNightDuty] = useState([]);
    const [files, setFiles] = useState();
    const [files1, setFiles1] = useState();
    // const [date, setDate] = useState();
    useMemo(() => {
        if (files?.length > 0) {
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const tempData = [];
                data.forEach((newData, index) => {
                    if (index > 2)
                        tempData.push({
                            crew_id: newData[1],
                            name: newData[2],
                            designation: newData[3],
                            footplate_km: typeof newData[5] === 'number' ? newData[5] : 0,
                        })
                })
                setFootplate(tempData);
            };
            files && reader.readAsBinaryString(files[0]?.originFileObj);
            setFiles([]);
        }
    }, [files]);
    useEffect(()=>{
        console.log(nightDuty);
    },[nightDuty])
    useMemo(() => {
        if (files1?.length > 0) {
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const tempData = [];
                data.forEach((newData, index) => {
                    if (index > 2)
                        tempData.push({
                            crew_id: newData[0],
                            name: newData[1],
                            designation: newData[3],
                            nightduty_hours: newData[33] !== '-' ? newData[33] : '0:0',
                        })
                })
                setNightDuty(tempData);
            };
            files1 && reader.readAsBinaryString(files1[0]?.originFileObj);
            setFiles1([]);
        }
    }, [files1]);
    const exportFile = (data) => {
        /* convert state to workbook */
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "sheetjs.xlsx");
    }
    const toSeconds = (str) => {
        console.log(str);
        str = str.split(':');
        return (+str[0]) * 60 + (+str[1]);  
    };
     
    const toHHss = (seconds) => {
        let minutes = parseInt(seconds/60);
        seconds = seconds - minutes*60;
        if(seconds > 30) minutes+=1;
        return minutes;
    };
    const generateReport = () =>{
        var helper = {};
        var result = footplate.reduce(function (r, o) {
            var key = o.crew_id

            if (!helper[key]) {
                helper[key] = Object.assign({}, o);
                r.push(helper[key]);
            } else {
                helper[key].footplate_km += o.footplate_km;
            }
            return r;
        }, []);
        if (result.length > 0) {
            const aoa = [ 'ALP', 'SALP', 'SSHT', 'SHT', 'LPM', 'LPP', 'LPG', ].map((val) => {
                return [val,
                    result.filter((res) => res.designation === val)?.length,
                    Math.round(result.filter((res) => res.designation === val).reduce((acc, obj) => acc += obj.footplate_km, 0)),
                    "",
                    "",
                    nightDuty.filter((ndh) => ndh.designation === val && ndh.nightduty_hours !== '0:0').length,
                    toHHss(nightDuty.filter((ndh) => ndh.designation === val && ndh.nightduty_hours !== '0:0').reduce((r,elem) => r + toSeconds(elem.nightduty_hours), 0)),
                    "",
                    ""  
                ]
            })
            console.log(aoa);
            exportFile(aoa);
        }
    }
    return (
        <>
            <UploadComponent files={files} setFiles={setFiles} message="Upload Footplate File"/>
            <UploadComponent files={files1} setFiles={setFiles1} message="Upload Night Duty File"/>
            <DatePicker onChange={(date, dateString) => { console.log(dateString); }} />
            <Button onClick={generateReport} style={{ backgroundColor: 'lightgreen' }}>Generate</Button>
        </>
    )
}
export default Footplate;