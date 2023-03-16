
import { Fragment, ReactElement } from 'react'

import c from '@/styles/ContentJwVideoTeaser'

const CustomHeader = ({ isFront, title }: { isFront: boolean; title: string }): ReactElement => {
  return (
    <Fragment>
      {isFront ? (
        <h2 className={c`jwplayer__videoTeaser__title`}>{title}</h2>
      ) : (
        <h3 className={c`jwplayer__videoTeaser__title`}>{title}</h3>
      )}
    </Fragment>
  )
}
export default CustomHeader
