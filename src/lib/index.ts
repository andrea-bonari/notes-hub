import courses from './courses.json' with { type: 'json' }
import it from './assets/it.png';
import gb from './assets/gb.png';


type color = "gray" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "fuchsia" | "purple" | "pink" | "rose";

const colors = ["red", "orange", "lime", "cyan", "sky", "green", "indigo", "violet", "teal", "fuchsia", "purple", "pink"] as const;
const codeMap : Record<string, color> = { }

interface RawCourse {
    [key: string] : {
        courses: {
            name: string;
            code: string[];
            description: string;
            url: string;
            year: number;
            credits: number;

            isEnglish?: boolean;
            isWIP?: boolean;
            isNotAvailable?: boolean;

            isProject?: boolean;
        }[]
    }
}

export const parseCourses = () => {
    const rawCourses = courses as RawCourse;

    let colorIndex = 0;

    return Object.entries(rawCourses).map(([key, value]) => {
        return {
            name: key,
            courses: value.courses.map(course => {
                return {
                    ...course,
                    code: course.code.map(code => {
                        if (!codeMap[code]) {
                            codeMap[code] = colors[colorIndex];
                            colorIndex = (colorIndex + 1) % colors.length;
                        }

                        return {
                            color: codeMap[code] || 'gray',
                            code
                        }
                    }),
                    flag: course.isEnglish ? gb : it,
                }
            })
        }
    })
}