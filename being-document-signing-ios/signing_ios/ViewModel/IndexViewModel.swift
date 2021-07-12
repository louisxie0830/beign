//
//  IndexViewModel.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/22.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import RxCocoa
import RxSwift

class IndexItem {
    enum IndexType {
        case none
        case text
        case icon
    }
    var title: String
    var icon: String
    var count: Int
    var type: IndexType
    
    init(_ title: String, icon: String, count: Int, type: IndexType) {
        self.title = title
        self.icon = icon
        self.count = count
        self.type = type
    }
}

class IndexViewModel {
    
    let disposebag = DisposeBag()
    let isSuccess = Variable<Bool>(false)
    let isLoading = Variable<Bool>(false)
    let dataSource = Variable<[IndexItem]>([])
    
    init() {
        dataSource.value = [
            IndexItem("待我簽署", icon: "baseline_query_builder_white_24pt", count: 0, type: .icon),
            IndexItem("我發起的", icon: "outline_border_color_white_24pt", count: 0, type: .icon),
            IndexItem("接收副本", icon: "outline_file_copy_white_24pt", count: 0, type: .icon),
            IndexItem("全部文件", icon: "", count: 0, type: .text),
        ]
    }
    
    func bind() {
        self.isLoading.value = true
        
        letterProvider.rx.request(.status).subscribe { event in
            switch event {
            case let .success(response):
                do {
                    let model = try response.mapObject(_type: LetterStatus.self)
                    
                    self.isLoading.value = false
                    self.isSuccess.value = (model.code == 200)
                    
                    self.dataSource.value[0].count = model.data.pending
                    self.dataSource.value[2].count = model.data.sendToMe
                    self.dataSource.value[3].count = model.data.myOwn
                }
                catch {
                    self.isLoading.value = false
                    self.isSuccess.value = false
                }
            case .error:
                self.isLoading.value = false
                self.isSuccess.value = false
            }
        }.disposed(by: disposebag)
    }
}
