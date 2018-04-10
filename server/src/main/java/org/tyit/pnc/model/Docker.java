/*
 * Copyright 2017 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
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
package org.tyit.pnc.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Entity
@Table(name = "DOCKER")
public class Docker implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @Basic(optional = false)
  @NotNull
  @Column(name = "ID")
  private String id;
  @Basic(optional = false)
  @NotNull
  @Lob
  @Column(name = "SETTINGS")
  private String settings;
  @Basic(optional = false)
  @NotNull
  @Column(name = "TMP_DIR")
  private String tmpDir;
  @Basic(optional = false)
  @NotNull
  @Column(name = "IMAGE_ID")
  private Long imageId;
  @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
  @ManyToOne(optional = false)
  private AppUser userId;
  @JoinColumn(name = "PROJECT_ID", referencedColumnName = "ID")
  @ManyToOne(optional = false)
  private Project projectId;
  @JoinColumn(name = "PLUGIN_ID", referencedColumnName = "ID")
  @ManyToOne(optional = false)
  private Plugin pluginId;

  public Docker() {
  }

  public Docker(String id) {
    this.id = id;
  }

  public Docker(String id, String settings, String tmpDir, Long imageId, AppUser userId, Project projectId, Plugin pluginId) {
    this.id = id;
    this.settings = settings;
    this.tmpDir = tmpDir;
    this.imageId = imageId;
    this.userId = userId;
    this.projectId = projectId;
    this.pluginId = pluginId;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getSettings() {
    return settings;
  }

  public void setSettings(String settings) {
    this.settings = settings;
  }

  public String getTmpDir() {
    return tmpDir;
  }

  public void setTmpDir(String tmpDir) {
    this.tmpDir = tmpDir;
  }

  public AppUser getUserId() {
    return userId;
  }

  public void setUserId(AppUser userId) {
    this.userId = userId;
  }

  public Long getImageId() {
    return imageId;
  }

  public void setImageId(Long imageId) {
    this.imageId = imageId;
  }

  public Project getProjectId() {
    return projectId;
  }

  public void setProjectId(Project projectId) {
    this.projectId = projectId;
  }

  public Plugin getPluginId() {
    return pluginId;
  }

  public void setPluginId(Plugin pluginId) {
    this.pluginId = pluginId;
  }

  @Override
  public int hashCode() {
    int hash = 0;
    hash += (id != null ? id.hashCode() : 0);
    return hash;
  }

  @Override
  public boolean equals(Object object) {
    // TODO: Warning - this method won't work in the case the id fields are not set
    if (!(object instanceof Docker)) {
      return false;
    }
    Docker other = (Docker) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "org.tyit.pnc.model.Docker[ id=" + id + " ]";
  }

}
