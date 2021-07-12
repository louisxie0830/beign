//
//  BuyTypeView.swift
//  signing_ios
//
//  Created by Alex on 2019/4/17.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

protocol BuyTypeViewDelegate {
    func  changeView()
}

class BuyTypeView: UIView, UITableViewDataSource, UITableViewDelegate, NextCellDelegate, CardBuyCellDelegate {
    var delegate: BuyTypeViewDelegate?
    let noSelect = 1001
    var selectRow: Int!
    let data: [[[String : String]]] = [[["title" : "buy_type_title".localized(),
                                      "hint" : "buy_type_title_hint".localized(),
                                      "type" : "select",
                                      "sup" : "伊凡達科技股份有限公司"],
                                     ["title" : "buy_type_lost_count".localized(),
                                      "hint" : "",
                                      "type" : "label",
                                      "sup" : "8"],
                                     ["title" : "buy_type_project_title".localized(),
                                      "hint" : "",
                                      "type" : "label_count",
                                      "sup" : ""],
                                     ["title" : "1" + "buy_type_count".localized(),
                                      "hint" : "",
                                      "type" : "buy",
                                      "sup" : "150 NTD"],
                                     ["title" : "10" + "buy_type_count".localized(),
                                      "hint" : "",
                                      "type" : "buy",
                                      "sup" : "1350 NTD"],
                                     ["title" : "100" + "buy_type_count".localized(),
                                      "hint" : "",
                                      "type" : "buy",
                                      "sup" : "12000 NTD"],
                                     ["title" : "500" + "buy_type_count".localized(),
                                      "hint" : "",
                                      "type" : "buy",
                                      "sup" : "54000 NTD"],
                                     ["title" : "1000" + "buy_type_count".localized(),
                                      "hint" : "",
                                      "type" : "buy",
                                      "sup" : "90000 NTD"]]]
    @IBOutlet weak var tableView: UITableView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        selectRow = noSelect
        tableView.register(UINib(nibName: "CardSelectCell", bundle: nil), forCellReuseIdentifier: "CardSelectCell")
        tableView.register(UINib(nibName: "CardLabelCell", bundle: nil), forCellReuseIdentifier: "CardLabelCell")
        tableView.register(UINib(nibName: "CardBuyCell", bundle: nil), forCellReuseIdentifier: "CardBuyCell")
        tableView.register(UINib(nibName: "CardNextCell", bundle: nil), forCellReuseIdentifier: "CardNextCell")
        tableView.register(UINib(nibName: "CardFooterView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardFooterView")
        tableView.register(UINib(nibName: "CardHeaderView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardHeaderView")
    }
    
    func nextButtonEvent() {
        delegate?.changeView()
    }
    
    private func setLabel(countString: String) -> NSMutableAttributedString  {
        let dataString: String = countString
        let baseString = dataString + "buy_type_count".localized()
        let attributedString = NSMutableAttributedString(string: baseString)
        
        attributedString.addAttribute(.font,
                                      value: UIFont.init(name: "Chalkduster", size: 14)!,
                                      range: NSString(string: baseString).range(of: "buy_type_count".localized()))
        
        attributedString.addAttribute(.foregroundColor,
                                      value: UIColor.gray,
                                      range: NSString(string: baseString).range(of: "buy_type_count".localized()))
        return attributedString
    }
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        return data.count + 1
    }
    
    public func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if section == 0 {
            return 24.0
        }
        else {
            return 0
        }
    }
    
    public func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        if section == 0 {
            return 20.0
        }
        else {
            return 0
        }
    }
    
    public func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if section == 0 {
            let headerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardHeaderView") as! CardHeaderView
            return headerView
        }
        else {
            return nil
        }
    }
    
    public func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        if section == 0 {
            let footerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardFooterView") as! CardFooterView
            return footerView
        }
        else {
            return nil
        }
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section == 0 {
            return data[section].count
        }
        else {
            return 1
        }
    }
    
    public func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableView.automaticDimension
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section == 0 {
            let object: Dictionary = data[indexPath.section][indexPath.row]
            if indexPath.row == 0 {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardSelectCell", for: indexPath) as! CardSelectCell
                cell.titleLabel.text = object["title"]
                cell.supLabel.text = object["hint"]
                cell.selectTitleLabel.text = object["sup"]
                return cell
            }
            else if object["type"] == "label" {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardLabelCell", for: indexPath) as! CardLabelCell
                cell.countLabel.isHidden = false
                cell.titleLabel.text = object["title"]
                cell.countLabel.attributedText = setLabel(countString: "8")
                return cell
            }
            else if object["type"] == "label_count" {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardLabelCell", for: indexPath) as! CardLabelCell
                cell.countLabel.isHidden = true
                cell.titleLabel.text = object["title"]
                return cell
            }
            else {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardBuyCell", for: indexPath) as! CardBuyCell
                cell.row = indexPath.row
                
                if selectRow == indexPath.row {
                    cell.selectButton.image = Icon.cm.check
                    cell.selectButton.backgroundColor = UIColor.aqua
                    cell.bgView.backgroundColor = UIColor.paleBlue
                }
                else {
                    cell.selectButton.image = nil
                    cell.selectButton.backgroundColor = UIColor.white
                    cell.bgView.backgroundColor = UIColor.white
                }
                
                cell.titleLabel.text = object["title"]
                cell.priceLabel.text = object["sup"]
                cell.delegate = self
                return cell
            }
            
        }
        else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "CardNextCell", for: indexPath) as! CardNextCell
            if selectRow == noSelect {
                cell.nextButton.disable = true
            }
            else {
                cell.nextButton.disable = false
            }
            cell.delegate = self
            return cell
        }
    }
    func selectItem(row: Int) {
        selectRow = row
        tableView.reloadData()
    }
}
