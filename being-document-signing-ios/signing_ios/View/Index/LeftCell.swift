//
//  LeftCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/8.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit

class LeftCell: UITableViewCell {

    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.s()
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

}
