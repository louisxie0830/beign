//
//  SignFooterView.swift
//  signing_ios
//
//  Created by Alex on 2019/4/26.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit

class SignFooterView: UITableViewHeaderFooterView {
    @IBOutlet weak var leadingConstraint: NSLayoutConstraint!
    @IBOutlet weak var trailingConstraint: NSLayoutConstraint!
    @IBOutlet weak var footerView: UIView!
    
    override func awakeFromNib() {
        super .awakeFromNib()
        corner()
    }
    
    func corner() {
        let screenSize = UIScreen.main.bounds.size
        let width = screenSize.width - (leadingConstraint.constant + trailingConstraint.constant)
        
        let rect = footerView.bounds
        
        let bezierPath = UIBezierPath()
        
        bezierPath.move(to: CGPoint(x: 0, y: 0))
        bezierPath.addLine(to: CGPoint(x: 0, y: rect.size.height - 12))
        bezierPath.addQuadCurve(to: CGPoint(x: 12, y: rect.size.height), controlPoint: CGPoint(x: 0, y: rect.size.height))
        
        bezierPath.addLine(to: CGPoint(x: width - 12, y: rect.size.height))
        bezierPath.addQuadCurve(to: CGPoint(x: width, y: rect.size.height - 12), controlPoint: CGPoint(x: width, y: rect.size.height))
        bezierPath.addLine(to: CGPoint(x: width, y: 0))
        
        let layer = CAShapeLayer()
        layer.strokeColor = UIColor(red:0.96, green:0.96, blue:0.96, alpha:1.0).cgColor
        layer.fillColor = UIColor.white.cgColor
        layer.path = bezierPath.cgPath
        layer.lineWidth = 0.0
        layer.shadowOffset = CGSize(width: 2, height: 1)
        layer.shadowRadius = 0
        layer.shadowOpacity = 3
        layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.14).cgColor
        footerView.layer.addSublayer(layer)
    }
}
