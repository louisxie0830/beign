//
//  SignScheduleCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/29.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit

class SignScheduleCell: UITableViewCell {
    @IBOutlet weak var iconBottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var signLabelBottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var dateLabelBottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var bgView: UIView! {
        didSet {
            bgView.layer.shadowOffset = CGSize(width: 2, height:0)
            bgView.layer.shadowRadius = 0
            bgView.layer.shadowOpacity = 1
            bgView.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        }
    }
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xl()
            titleLabel.textColor = UIColor.dark
        }
    }
    @IBOutlet weak var emailLabel: UILabel! {
        didSet {
            emailLabel.xs()
            emailLabel.textColor = UIColor.dark56
        }
    }
    @IBOutlet weak var iconImageView: UIImageView!
    @IBOutlet weak var isSignLabel: UILabel! {
        didSet {
            isSignLabel.xs()
            isSignLabel.textColor = UIColor.seaweed
        }
    }
    @IBOutlet weak var dateLabel: UILabel! {
        didSet {
            dateLabel.xss()
            dateLabel.textColor = UIColor.dark28
        }
    }
    
    @IBOutlet weak var upLineView: UIView! {
        didSet {
            upLineView.backgroundColor = UIColor.dark40
            upLineView.isHidden = false
        }
    }
    @IBOutlet weak var scheduleLabel: UILabel! {
        didSet {
            scheduleLabel.backgroundColor = UIColor.dark40
            scheduleLabel.layer.cornerRadius = 9.5
            scheduleLabel.xss()
            scheduleLabel.textColor = UIColor.white
            scheduleLabel.clipsToBounds = true
        }
    }
    @IBOutlet weak var underLineView: UIView! {
        didSet {
            underLineView.backgroundColor = UIColor.dark40
            underLineView.isHidden = false
        }
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    public func setUI() {
        iconImageView.isHidden = true
        dateLabel.isHidden = true
        isSignLabel.isHidden = true
//        iconBottomConstraint.constant = emailLabel.frame.size.height + 8
//        dateLabelBottomConstraint.constant = emailLabel.frame.size.height + 8
//        signLabelBottomConstraint.constant = emailLabel.frame.size.height + 8
    }
}
