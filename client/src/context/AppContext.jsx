import { createContext } from "react";
import { dummyCourses } from "../assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    
    // Fetch All Courses //
    const fetchAllCourses = async ()=>{
        setAllCourses(dummyCourses)
    }
    // Function To Calculate Average Rating Of Courses //
    const calculateRating = (course)=>{
        if(course.courseRatings.length === 0){
        return 0;
    }
    let totalRating = 0
    course.courseRatings.forEach(rating => {
        totalRating += rating.rating
    })
    return totalRating / course.courseRatings.length
    }
    // Function To Calculate Courses Chapter Time //
    const calculateChapterTime = (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
            // Assuming each lecture has a 'duration' property
            return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
        }
    // Function To Calculate Course Duration //
    const calculateCourseDuration = (course) => {
    let totalMinutes = 0;
    course.courseContent.forEach(chapter => {
        chapter.chapterContent.forEach(lecture => {
            totalMinutes += lecture.lectureDuration; // لازم تكون بالدقائق
        });
    });
    // نرجع النتيجة بشكل مفهوم مثل: "1 hour, 55 minutes"
    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"], round: true });
};
    // const calculateCourseDuration = (course)=>{
    //     let time = 0
    //     course.courseContent.map((chapter)=> time += chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration))
    //     return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    // }
    // Function To Calculate The Number Of Lecture In The Course  //
    const calculateNumberOfLectures = (course)=>{
        let totalLectures = 0
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
            });
        return totalLectures;
    }
    // Fetch User Enrolled Courses //
    const fetchUserEnrolledCourses = async ()=>{
        setEnrolledCourses(dummyCourses)
    }
    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])
    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime,
        calculateCourseDuration, calculateNumberOfLectures, enrolledCourses, fetchUserEnrolledCourses
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}