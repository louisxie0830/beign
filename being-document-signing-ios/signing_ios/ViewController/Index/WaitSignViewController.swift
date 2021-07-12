//
//  WaitSignViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/24.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxCocoa
import RxSwift

class WaitSignViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    let disposed = DisposeBag()
    var data: [[String : String]] = [["title" : "這裡是合約的主題文字最多一行超過...",
                                      "company" : "Cygames", "date" : "2011/5/9",
                                      "companyTitle" : "company_title".localized(), "tag" : "我不是TAG"],
                                     ["title" : "這裡是合約的主題文字最多一行超過...",
                                      "company" : "Cygames", "date" : "2011/5/9",
                                      "companyTitle" : "company_title".localized(), "tag" : ""],
                                     ["title" : "這裡是合約的主題文字最多一行超過...",
                                      "company" : "Cygames", "date" : "2011/5/9",
                                      "companyTitle" : "company_title".localized(), "tag" : "我不是TAG"]]

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
//    [self setModalTransitionStyle:UIModalTransitionStyleCrossDissolve];
//    [self setModalPresentationStyle:UIModalPresentationOverFullScreen];
    private func setup() {
        navigationItem.titleLabel.text = "navigation_title_wait_sign".localized()
        filterButton.rx.tap.subscribe(onNext: {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "WaitSignTagViewController") as! WaitSignTagViewController
            
            vc.modalTransitionStyle = UIModalTransitionStyle.crossDissolve
            vc.modalPresentationStyle = UIModalPresentationStyle.overFullScreen
            
            self.navigationController?.present(vc, animated: true, completion: nil)
            
        }).disposed(by: disposed)
    }
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "WaitSignCell", for: indexPath) as! WaitSignCell
        let dict = data[indexPath.row]
        
        cell.titleLabel.text = dict["title"]
        cell.companyTitleLabel.text = dict["companyTitle"]
        cell.companyNameLabel.text = dict["company"]
        cell.dateLabel.text = dict["date"]
        
        if dict["tag"]  == "" {
            cell.tagLabel.isHidden = true
        }
        else {
            cell.tagLabel.isHidden = false
        }
        
        let titleString: String = dict["tag"]!
        cell.setSignTag(titleString: titleString)
        
        return cell;
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let vc = self.storyboard?.instantiateViewController(withIdentifier: "SignDetailViewController") as! SignDetailViewController
        navigationController?.pushViewController(vc, animated: true)
    }
}
