import type { JSX } from 'react'

import MSCheck from '@material-symbols/svg-400/rounded/check.svg'
import MSClose from '@material-symbols/svg-400/rounded/close.svg'
import MSInfo from '@material-symbols/svg-400/rounded/info.svg'
import MSMenu from '@material-symbols/svg-400/rounded/menu.svg'
import MSPsychologyAlt from '@material-symbols/svg-400/rounded/psychology_alt.svg'
import MSQuiz from '@material-symbols/svg-400/rounded/quiz.svg'
import MSVisibility from '@material-symbols/svg-400/rounded/visibility.svg'
import MSRule from '@material-symbols/svg-400/rounded/rule.svg'
import MSStat0 from '@material-symbols/svg-400/rounded/stat_0.svg'
import MSStat1 from '@material-symbols/svg-400/rounded/stat_1.svg'
import MSStat2 from '@material-symbols/svg-400/rounded/stat_2.svg'
import MSStat3 from '@material-symbols/svg-400/rounded/stat_3.svg'
import MSStatM1 from '@material-symbols/svg-400/rounded/stat_minus_1.svg'
import MSStatM2 from '@material-symbols/svg-400/rounded/stat_minus_2.svg'
import MSStatM3 from '@material-symbols/svg-400/rounded/stat_minus_3.svg'
import MSViewList from '@material-symbols/svg-400/rounded/view_list.svg'

import style from './icon.module.css'


export interface IconParams {
    className?: string,
    fill?: string,
    size?: number,
    onClick?: React.MouseEventHandler<HTMLElement>,
}

export type Icon = (params: IconParams) => JSX.Element

const icon = (i: (params: IconParams) => React.ReactElement): Icon => {
    return (params: IconParams) => {
        let className = undefined
        if (typeof className === 'undefined') {
            className = style.icon24
            if (typeof params.size !== 'undefined') {
                switch(params.size) {
                    case 20:
                        className = style.icon20
                        break
                    case 32:
                        className = style.icon32
                        break
                    case 48:
                        className = style.icon48
                        break
                    case 96:
                        className = style.icon96
                        break
                }
            }
        }
        return i({ className, ...params })
    }
}

export const About = icon(MSInfo)
export const Check = icon(MSCheck)
export const Eye = icon(MSVisibility)
export const Menu = icon(MSMenu)
export const Quiz = icon(MSQuiz)
export const Rule = icon(MSRule)
export const Stat0 = icon(MSStat0)
export const StatP1 = icon(MSStat1)
export const StatP2 = icon(MSStat2)
export const StatP3 = icon(MSStat3)
export const StatM1 = icon(MSStatM1)
export const StatM2 = icon(MSStatM2)
export const StatM3 = icon(MSStatM3)
export const Think = icon(MSPsychologyAlt)
export const ViewList = icon(MSViewList)
export const Xmark = icon(MSClose)
