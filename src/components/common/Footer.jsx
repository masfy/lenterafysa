import React from 'react';
import { BadgeCheck } from 'lucide-react';

const Footer = ({ variant = "default" }) => (
    <div className={`w-full py-4 flex items-center justify-center text-xs text-gray-500 gap-1 ${variant === 'mobile' ? 'pb-24' : ''}`}>
        <span>© 2025</span>
        <span>|</span>
        <span>Dibuat oleh Mas Alfy</span>
        <BadgeCheck className="w-3 h-3 text-blue-500" />
    </div>
);

export default Footer;
