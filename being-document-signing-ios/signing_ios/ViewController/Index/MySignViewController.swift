//
//  MySignViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/25.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

enum SignStatus {
    case signing
    case signCancel
    case signDone
    case signRefusal
}

class MySignViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    var data: [[String : Any]] = [["title" : "這裡是合約的主題文字最多一行超過...",
                                      "company" : "Cygames", "date" : "2011/5/9",
                                      "companyTitle" : "company_title".localized(),
                                      "status" : SignStatus.signing, "tag" : "我不是TAG"],
                                     ["title" : "這裡是合約的主題文字最多一行超過...",
                                      "company" : "Cygames", "date" : "2011/5/9",
                                      "companyTitle" : "company_title".localized(),
                                      "status" : SignStatus.signCancel, "tag" : ""],
                                     ["title" : "這裡是合約的主題文字最多一行超過...",
                                      "company" : "Cygames", "date" : "2011/5/9",
                                      "companyTitle" : "company_title".localized(),
                                      "status" : SignStatus.signDone, "tag" : ""],
                                     ["title" : "這裡是合約的主題文字最多一行超過...",
                                      "company" : "Cygames", "date" : "2011/5/9",
                                      "companyTitle" : "company_title".localized(),
                                      "status" : SignStatus.signRefusal, "tag" : "我今天一個TAG"]]
    @IBOutlet weak var searchView: UIView!
    @IBOutlet weak var searchBroadView: UIView! {
        didSet {
            searchBroadView.backgroundColor = UIColor(red: 25.0 / 255.0,
                                                      green: 31.0 / 255.0,
                                                      blue:37.0 / 255.0 ,
                                                      alpha: 0.08)
            searchBroadView.layer.cornerRadius = 3
        }
    }
    @IBOutlet weak var searchTextField: UITextField! {
        didSet {
            searchTextField.placeholder = "search_text_placeholder".localized()
        }
    }
    @IBOutlet weak var filterButton: RaisedButton! {
        didSet {
            filterButton.tintColor = UIColor(red:0.50, green:0.53, blue:0.55, alpha:1.0)
            filterButton.image = UIImage(named: "outline_filter_list_white_24pt")
            filterButton.nonBoder()
        }
    }
    @IBOutlet weak var tableView: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        // Do any additional setup after loading the view.
    }
    private func setup() {
        navigationItem.titleLabel.text = "我發起的"
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MySignCell", for: indexPath) as! MySignCell
        let dict = data[indexPath.row]
        
        cell.titleLabel.text = dict["title"] as? String
        cell.companyTitleLabel.text = dict["companyTitle"] as? String
        cell.companyNameLabel.text = dict["company"] as? String
        cell.dateLabel.text = dict["date"] as? String
        
        var signString: String = ""
        let status = (dict["status"] as? SignStatus)!
        var statusColor: UIColor? = nil
        
        switch status {
            case .signing:
                statusColor = UIColor.orangeish
                signString = "簽署中"
                break
            case .signDone:
                statusColor = UIColor.seaweed
                signString = "已完成"
                break
            case .signCancel:
                statusColor = UIColor.dark40
                signString = "已撤回"
                break
            case .signRefusal:
                statusColor = UIColor.pastelred
                signString = "已拒絕"
                break
        }
        
        if dict["tag"] as? String == "" {
            cell.tagLabel.isHidden = true
        }
        else {
            cell.tagLabel.isHidden = false
        }
        
        let titleString: String = dict["tag"]! as! String
        cell.setSignTag(titleString: titleString)
        cell.statusLabel.text = signString
        cell.statusLabel.backgroundColor = statusColor
        
        return cell;

    }
}
