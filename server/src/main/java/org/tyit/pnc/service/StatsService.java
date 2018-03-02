/*
 * Copyright 2018 Pivotal Software, Inc..
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.tyit.pnc.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.DeveloperRepository;
import org.tyit.pnc.repository.PluginRepository;

/**
 *
 * @author Raees R. Mulla
 */
@Service
public class StatsService {
    
    @Autowired
    private PluginRepository pluginRepository;
    
    @Autowired
    private AppUserRepository appUserRepository;
    
    @Autowired
    private DeveloperRepository developerRepository;
    

    public Map<String, Integer> getTotalCount() {
        Map<String, Integer> map = new HashMap<>();
        map.put("users", (int) appUserRepository.findAll().spliterator().getExactSizeIfKnown());
        map.put("plugins", (int) pluginRepository.findAll().spliterator().getExactSizeIfKnown());
        map.put("developers", (int) developerRepository.findAll().spliterator().getExactSizeIfKnown());
        return map;
    }

    public void getUserPerMonth() {
    }

    public void getPluginsPerMonth() {
    }

    public List<List<String>> getPluginsPerInstalls() {
        // abi count aa raha, usko apan percent kar deteacha
        List<List<String>> outerList = new ArrayList<>();
        Iterable<Plugin> plugins = pluginRepository.findAllApproved();
        int totalCount = 0;
        for (Plugin plugin: plugins) {
           List<String> innerList = new ArrayList<>();
           int count =  plugin.getAppUserCollection().size();
           totalCount += count;
           innerList.add(plugin.getName());
           innerList.add(String.valueOf(count));
           outerList.add(innerList);
        }
        
        // filter out all the lists with count 0
        outerList = outerList.stream()
                        .filter(i -> Double.parseDouble(i.get(1)) > 0)
                        .collect(Collectors.toList());
        
        for (List<String> list: outerList) {
            int oldCount = Integer.parseInt(list.get(1));
            double newCount = (double) (oldCount * 100 / totalCount);
            list.set(1, String.valueOf(newCount));
        }
        return outerList;
    }
}
