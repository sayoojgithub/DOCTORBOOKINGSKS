import { formateDate } from '../../Utils/formateDate';

const DoctorAbout = ({ doctorDetails }) => {
  console.log(doctorDetails);

  return (
    <div>
      {doctorDetails && (
        <div className='mt-12'>
          <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>Experience</h3>
          <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>
            {doctorDetails.experiences.map((experience) => (
              <li key={experience._id} className='p-4 rounded bg-[#fff9ea]'>
                <span className='text-yellowColor text-[15px] leading-6 font-semibold'>
                  {formateDate(experience.fromDate)} - {formateDate(experience.toDate)}
                </span>
                <p className='text-[16px] leading-6 font-medium text-textColor'>{experience.hospitalName}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorAbout;