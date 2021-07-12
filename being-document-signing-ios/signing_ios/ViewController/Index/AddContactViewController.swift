//
//  AddContactViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/19.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

protocol AddContactViewControllerDelegate {
    func addSuccess()
}

class AddContactViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    let disposed = DisposeBag()
    var delegate: AddContactViewControllerDelegate?
    let data: [[String : String]] = [["title" : "name".localized(),
                                      "hint" : "please_input_name".localized(),
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "email".localized(),
                                      "hint" : "please_input_email".localized(),
                                      "type" : "cardfield",
                                      "sup" : ""]]
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var addButton: RaisedButton! {
        didSet {
            addButton.layer.cornerRadius = 22
            addButton.disable = false
        }
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        // Do any additional setup after loading the view.
    }
    func setup() {
        navigationItem.titleLabel.text = "being_protocol_service".localized()
        tableView.register(UINib(nibName: "CardFieldCell", bundle: nil), forCellReuseIdentifier: "CardFieldCell")
        tableView.register(UINib(nibName: "CardHeaderView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardHeaderView")
        tableView.register(UINib(nibName: "CardFooterView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardFooterView")
        
        addButton.rx.tap.subscribe(onNext: {
            self.add()
        }).disposed(by: disposed)
    }
    
    private func add() {
        guard let delegate = delegate else {
            return
        }
        delegate.addSuccess()
        navigationController?.popViewController(animated: true)
    }
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    public func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 24.0
    }
    
    public func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 20.0
    }
    
    public func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardHeaderView") as! CardHeaderView
        return headerView
    }
    
    public func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        let footerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardFooterView") as! CardFooterView
        return footerView
        
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "CardFieldCell", for: indexPath) as! CardFieldCell
        let dict = data[indexPath.row]
        
        cell.titleLabel.text = dict["title"]!
        cell.textField.placeholder = dict["hint"]
        cell.supLabel.text = dict["sup"]
        let type: String = dict["type"]!
        
        cell.setupUI(type: type)
        
        return cell;
    }
}
