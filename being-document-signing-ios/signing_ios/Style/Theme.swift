//
//  Theme.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/3/21.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import Material

extension UILabel {
    
    func xxl() {
        font = UIFont.systemFont(ofSize: 20.0)
    }
    
    func xl() {
        font = UIFont.systemFont(ofSize: 17.0)
    }
    
    func l() {
        font = UIFont.systemFont(ofSize: 16.0)
    }
    
    func m() {
        font = UIFont.systemFont(ofSize: 15.0)
    }
    
    func s() {
        font = UIFont.systemFont(ofSize: 14.0)
    }
    
    func xs() {
        font = UIFont.systemFont(ofSize: 13.0)
    }
    
    func xss() {
        font = UIFont.systemFont(ofSize: 12.0)
    }
    
    func smaller() {
        font = UIFont.systemFont(ofSize: 10.0)
    }
}

extension UIColor {
    class var dark: UIColor {
        return UIColor(red: 25.0 / 255.0,
                       green: 31.0 / 255.0,
                       blue:37.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var dark8: UIColor {
        return UIColor(red: 25.0 / 255.0,
                       green: 31.0 / 255.0,
                       blue:37.0 / 255.0 ,
                       alpha: 0.08)
    }
    class var dark12: UIColor {
        return UIColor(red: 25.0 / 255.0,
                       green: 31.0 / 255.0,
                       blue:37.0 / 255.0 ,
                       alpha: 0.12)
    }
    class var dark28: UIColor {
        return UIColor(red: 25.0 / 255.0,
                       green: 31.0 / 255.0,
                       blue:37.0 / 255.0 ,
                       alpha: 0.28)
    }
    
    class var dark40: UIColor {
        return UIColor(red: 25.0 / 255.0,
                       green: 31.0 / 255.0,
                       blue:37.0 / 255.0 ,
                       alpha: 0.4)
    }
    class var dark56: UIColor {
        return UIColor(red: 25.0 / 255.0,
                       green: 31.0 / 255.0,
                       blue:37.0 / 255.0 ,
                       alpha: 0.56)
    }
    class var turquoiseBlue: UIColor {
        return UIColor(red: 16.0 / 255.0,
                       green: 172.0 / 255.0,
                       blue:206.0 / 255.0 ,
                       alpha: 1.0)
    }
    
    class var aqua: UIColor {
        return UIColor(red: 19.0 / 255.0,
                       green: 195.0 / 255.0,
                       blue:234.0 / 255.0 ,
                       alpha: 1.0)
    }
    
    class var robinWggBlue: UIColor {
        return UIColor(red: 149.0 / 255.0,
                       green: 221.0 / 255.0,
                       blue:237.0 / 255.0 ,
                       alpha: 1.0)
    }
    
    class var paleGrey: UIColor {
        return UIColor(red: 149.0 / 255.0,
                       green: 221.0 / 255.0,
                       blue:237.0 / 255.0 ,
                       alpha: 1.0)
    }
    
    class var lightPeriwinkle: UIColor {
        return UIColor(red: 220.0 / 255.0,
                       green: 223.0 / 255.0,
                       blue:230.0 / 255.0 ,
                       alpha: 1.0)
    }
    
    class var coolGrey: UIColor {
        return UIColor(red: 144.0 / 255.0,
                       green: 147.0 / 255.0,
                       blue: 153.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var slateGrey: UIColor {
        return UIColor(red: 96.0 / 255.0,
                       green: 98.0 / 255.0,
                       blue: 102.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var coolBlue: UIColor {
        return UIColor(red: 56.0 / 255.0,
                       green: 171.0 / 255.0,
                       blue: 208.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var slateGreyTwo: UIColor {
        return UIColor(red: 97.0 / 255.0,
                       green: 98.0 / 255.0,
                       blue: 103.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var paleBlue: UIColor {
        return UIColor(red: 214.0 / 255.0,
                       green: 240.0 / 255.0,
                       blue: 246.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var orangeish: UIColor {
        return UIColor(red: 255.0 / 255.0,
                       green: 148.0 / 255.0,
                       blue: 62.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var pastelred: UIColor {
        return UIColor(red: 242.0 / 255.0,
                       green: 86.0 / 255.0,
                       blue: 67.0 / 255.0 ,
                       alpha: 1.0)
    }
    class var seaweed: UIColor {
        return UIColor(red: 21.0 / 255.0,
                       green: 188.0 / 255.0,
                       blue: 131.0 / 255.0 ,
                       alpha: 1.0)
    }
}

extension RaisedButton {
    func whiteFill() {
        backgroundColor = UIColor.white
        titleColor = UIColor.turquoiseBlue
        layer.cornerRadius = 22.0
        fontSize = 14.0
    }
    
    func aquaFill() {
        backgroundColor = UIColor.aqua
        titleColor = UIColor.white
        layer.cornerRadius = 22.0
        fontSize = 14.0
    }
    
    func robinEggBlueBorder() {
        backgroundColor = UIColor.clear
        titleColor = UIColor.turquoiseBlue
        layer.cornerRadius = 22.0
        fontSize = 14.0
        borderWidthPreset = .border2
        borderColor = UIColor.robinWggBlue
    }
    
    func nonBoder() {
        backgroundColor = UIColor.clear
        titleColor = UIColor(red: 171.0 / 255.0,
                             green: 171.0 / 255.0,
                             blue: 182.0 / 255.0 ,
                             alpha: 1.0)
        layer.cornerRadius = 22.0
        fontSize = 14.0
    }
    
    var disable: Bool {
        set {
            isEnabled = !newValue
            let alpha: CGFloat = isEnabled ? 1.0 : 0.5
            backgroundColor = backgroundColor?.withAlphaComponent(alpha)
        }
        get {
            return isEnabled
        }
    }
}
