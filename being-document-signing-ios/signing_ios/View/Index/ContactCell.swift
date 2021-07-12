//
//  ContactCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/19.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

protocol ContactCellDelegate {
    func deleteContact(row: Int)
}

class ContactCell: UITableViewCell {

    var row: Int!
    var delegate: ContactCellDelegate?
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.textColor = UIColor.dark
            titleLabel.xl()
        }
    }
    @IBOutlet weak var emailLabel: UILabel! {
        didSet {
            emailLabel.textColor = UIColor.dark56
            emailLabel.xs()
        }
    }
    @IBOutlet weak var deleteButton: RaisedButton! {
        didSet {
            deleteButton.image = UIImage(named: "outline_delete_white_24pt")
            deleteButton.tintColor = UIColor.dark28
        }
    }
    @IBOutlet weak var underLineView: UIView!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    @IBAction private func deleteButtonAction(_ sender: Any) {
        guard let delegate = delegate else {
            return
        }
        delegate.deleteContact(row: row)
    }
}
