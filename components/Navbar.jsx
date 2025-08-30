import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AiOutlineShopping, AiOutlineUser } from 'react-icons/ai';
import { FiChevronDown } from 'react-icons/fi';

import { Cart } from './';
import { useStateContext} from '../context/StateContext';

const Navbar = () => {
  const { data: session } = useSession();
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">Ayush's Store</Link>
      </p>

      <div className="navbar-right">
        <div className="auth-container">
          {session ? (
            <div className="user-dropdown">
              <button 
                className="user-button" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <AiOutlineUser />
                <span className="user-name">{session.user.name.split(' ')[0]}</span>
                <FiChevronDown />
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link href="/profile">
                    <a className="dropdown-item">My Profile</a>
                  </Link>
                  <Link href="/checkout">
                    <a className="dropdown-item">Checkout</a>
                  </Link>
                  <button 
                    className="dropdown-item sign-out" 
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link href="/auth/signin">
                <a className="auth-link">Sign In</a>
              </Link>
              <Link href="/auth/register">
                <a className="auth-link register">Register</a>
              </Link>
            </div>
          )}
        </div>

        <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
          <AiOutlineShopping />
          <span className="cart-item-qty">{totalQuantities}</span>
        </button>
      </div>

      {showCart && <Cart />}
    </div>
  )
}

export default Navbar