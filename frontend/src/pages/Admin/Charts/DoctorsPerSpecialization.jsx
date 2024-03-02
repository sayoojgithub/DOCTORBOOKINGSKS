import React from 'react'
import {FunnelChart,Tooltip,Funnel,LabelList,Cell} from 'recharts'

const DoctorsPerSpecialization = ({data}) => {
    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
    console.log(data)
  return (
    <div className="w-full max-w-screen-xl mx-auto text-center">
        <FunnelChart width={800} height={350}>
  <Tooltip />
  <Funnel
    dataKey="totalDoctors"
    data={data}
    isAnimationActive
    label={(entry) => entry.name}
  >
  {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
    <LabelList position="right" fill="#000" stroke="none" dataKey="_id" />
  </Funnel>
</FunnelChart>
    </div>
  )
}

export default DoctorsPerSpecialization