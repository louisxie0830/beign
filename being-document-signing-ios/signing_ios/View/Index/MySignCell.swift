//
//  MySignCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/25.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

class MySignCell: UITableViewCell {
    @IBOutlet weak var widthConstraint: NSLayoutConstraint!
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xl()
            titleLabel.textColor = UIColor.dark
        }
    }
    @IBOutlet weak var companyTitleLabel: UILabel! {
        didSet {
            companyTitleLabel.xs()
            companyTitleLabel.textColor = UIColor.dark40
        }
    }
    @IBOutlet weak var companyNameLabel: UILabel! {
        didSet {
            companyNameLabel.xs()
            companyNameLabel.textColor = UIColor.dark40
        }
    }
    @IBOutlet weak var statusLabel: UILabel! {
        didSet {
            statusLabel.layer.cornerRadius = 2
            statusLabel.smaller()
            statusLabel.textColor = UIColor.white
        }
    }
    @IBOutlet weak var tagLabel: UILabel! {
        didSet {
            tagLabel.layer.cornerRadius = 2
            tagLabel.smaller()
            tagLabel.textColor = UIColor.white
            tagLabel.backgroundColor = UIColor.dark12
        }
    }
    @IBOutlet weak var dateLabel: UILabel! {
        didSet {
            dateLabel.xss()
            dateLabel.textColor = UIColor.dark28
        }
    }
    @IBOutlet weak var underLineView: UIView! {
        didSet {
            underLineView.backgroundColor = UIColor.dark8
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
    func setSignTag(titleString: String) {
        tagLabel.text = titleString
        tagLabel.sizeToFit()
        widthConstraint.constant = tagLabel.frame.size.width + 8
    }
}
