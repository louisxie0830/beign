//
//  CardHeaderView.swift
//  signing_ios
//
//  Created by Alex on 2019/3/25.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit

class CardHeaderView: UITableViewHeaderFooterView {
    @IBOutlet weak var leadingConstraint: NSLayoutConstraint!
    @IBOutlet weak var trailingConstraint: NSLayoutConstraint!
    @IBOutlet weak var headerView: UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        corner()
    }
    
    func corner() {
        
        let corn = 8
        
        let screenSize = UIScreen.main.bounds.size
        let width = screenSize.width - (leadingConstraint.constant + trailingConstraint.constant)
        
        let rect = headerView.bounds
        
        let bezierPath = UIBezierPath()
        
        bezierPath.move(to: CGPoint(x: 0, y: rect.size.height))
        bezierPath.addLine(to: CGPoint(x: 0, y: corn))
        bezierPath.addQuadCurve(to: CGPoint(x: corn, y: 0), controlPoint: CGPoint(x: 0, y: 0))
        
        bezierPath.addLine(to: CGPoint(x: width - 8, y: 0.0))
        bezierPath.addQuadCurve(to: CGPoint(x: width, y: rect.size.height), controlPoint: CGPoint(x: width, y: 0))
        bezierPath.addLine(to: CGPoint(x: width, y: rect.size.height))
        
        let layer = CAShapeLayer()
        layer.path = bezierPath.cgPath
        layer.strokeColor = UIColor(red:0.96, green:0.96, blue:0.96, alpha:1.0).cgColor
        layer.fillColor = UIColor.white.cgColor
        layer.lineWidth = 0.0
        layer.shadowOffset = CGSize(width: 2, height: -1)
        layer.shadowRadius = 0
        layer.shadowOpacity = 1
        layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        headerView.layer.addSublayer(layer)
    }
    
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */

}
