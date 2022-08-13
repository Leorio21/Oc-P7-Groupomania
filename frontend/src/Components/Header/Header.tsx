
import classNames from 'classnames';
import cn from './Header.module.scss'

import logo from '../../assets/logo_rose.webp'

const Header = () => {
    return (
        <header className={classNames(cn.header)}>
            <img src={logo} alt='logo Groupomania' />
            <h1>Groupomania</h1>
    </header>
    )
}

export default Header;